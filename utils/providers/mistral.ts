// utils/providers/mistral.ts

import {
  ProviderService,
  CompletionResult,
  registerProviderService,
} from '../providerService';
import { finalTokenTotal, approxTokensFromText } from '../tokens';

async function* streamOpenAIStyleResponse(
  response: Response
): AsyncGenerator<any, void, unknown> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) {
      if (part.startsWith('data: ')) {
        const data = part.substring(6);
        if (data.trim() === '[DONE]') return;
        try {
          yield JSON.parse(data);
        } catch (e) {
          // ignore malformed chunks
        }
      }
    }
  }
}

const mistralService: ProviderService = {
  providerId: 'mistral',

  async getModels(apiKey: string): Promise<string[]> {
    const res = await fetch('https://api.mistral.ai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error('Failed to fetch Mistral models');
    const data = await res.json();
    if (!Array.isArray(data?.data)) return [];
    return data.data.map((m: any) => m.id).filter(Boolean);
  },

  async *generate(
    prompt: string,
    model: string,
    apiKey: string
  ): AsyncGenerator<CompletionResult> {
    const startTime = Date.now();
    let firstTokenTime: number | undefined;
    let tokenCount = 0;
    let generatedText = '';

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
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
      throw new Error(`Mistral API error: ${response.status} ${errorBody}`);
    }

    for await (const chunk of streamOpenAIStyleResponse(response)) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        if (!firstTokenTime) firstTokenTime = Date.now();
        tokenCount++; // maintain for TPS-like metrics; final total computed below
        generatedText += content;
        yield { type: 'chunk', content };
      }
    }

    const finishTime = Date.now();
    const total = finalTokenTotal({ prompt, generated: generatedText });
    const inputTokens = approxTokensFromText(prompt);
    const outputTokens = approxTokensFromText(generatedText);
    yield { type: 'metrics', data: { startTime, firstTokenTime, finishTime, tokenCount: total, inputTokens, outputTokens } };
  },
};

registerProviderService(mistralService);
