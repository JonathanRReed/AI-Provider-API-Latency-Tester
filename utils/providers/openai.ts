// utils/providers/openai.ts

import {
  ProviderService,
  CompletionResult,
  registerProviderService,
} from '../providerService';

// A helper to parse the SSE stream from OpenAI
async function* streamOpenAIResponse(
  response: Response
): AsyncGenerator<any, void, unknown> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }
  const decoder = new TextDecoder('utf-8');
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.substring(6);
        if (data.trim() === '[DONE]') {
          return;
        }
        try {
          yield JSON.parse(data);
        } catch (e) {
          console.error('Error parsing OpenAI stream data:', e);
        }
      }
    }
  }
}

const openAIService: ProviderService = {
  providerId: 'openai',

  async getModels(apiKey: string): Promise<string[]> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch OpenAI models');
    }
    const { data } = await response.json();
    // Filter for gpt models which are for chat completions
    return data.map((model: any) => model.id).filter((id: string) => id.startsWith('gpt'));
  },

  async *generate(
    prompt: string,
    model: string,
    apiKey: string
  ): AsyncGenerator<CompletionResult> {
    const startTime = Date.now();
    let firstTokenTime: number | undefined;
    let tokenCount = 0;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorBody}`);
    }

    for await (const chunk of streamOpenAIResponse(response)) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        if (!firstTokenTime) {
          firstTokenTime = Date.now();
        }
        tokenCount++; // A simplification, actual token count is more complex
        yield { type: 'chunk', content };
      }
    }

    const finishTime = Date.now();
    yield {
      type: 'metrics',
      data: { startTime, firstTokenTime, finishTime, tokenCount },
    };
  },
};

registerProviderService(openAIService);
