import { performTogetherInference } from './fetchModels';

export interface ModelApiParams {
  provider: string;
  apiKey: string;
  model: string;
  prompt: string;
  endpoint?: string; // Add endpoint as an optional field
}

export interface ModelApiResult {
  output: string | null;
  latency: number | null;
  error?: string;
  usage?: any;
  cost?: number | null;
  totalTokens?: number | null;
}

// Cost per 1K tokens (USD) for a few common models (can be expanded)
const OPENAI_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4o': { input: 0.005, output: 0.015 },
};
const GROQ_PRICING: Record<string, number> = {
  'llama2-70b-4096': 0.0008,
  'mixtral-8x7b-32768': 0.0008,
  'gemma-7b-it': 0.0002,
  'llama3-70b-8192': 0.0008,
};

export async function callModelApi({
  provider, apiKey, model, prompt, endpoint
}: ModelApiParams): Promise<ModelApiResult> {
  const start = Date.now();
  try {
    let url = '';
    let headers: Record<string, string> = {};
    let body: any = {};
    let totalTokens = null;
    let costUsd = null;

    // Normalize provider id for comparison
    const providerId = provider.toLowerCase();

    if (providerId === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024
        })
      });
      const data = await res.json();
      const output = data.choices?.[0]?.message?.content || '';
      const latency = Date.now() - start;
      const usage = data.usage || null;
      const cost = usage ? estimateOpenAICost(model, usage) : null;
      return { output, latency, usage, cost, totalTokens: usage?.total_tokens ?? null };
    } else if (providerId === 'openrouter') {
      // Call backend API route to avoid CORS and get tokens/costs
      const res = await fetch('/api/openrouter-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model, prompt, max_tokens: 1024 })
      });
      const data = await res.json();
      console.log('[Frontend] /api/openrouter-completion response:', data);
      const output = data.output || '';
      const latency = Date.now() - start;
      const usage = data.usage || null;
      const cost = typeof data.cost === 'number' ? data.cost : null;
      return { output, latency, usage, cost, totalTokens: usage?.total_tokens ?? null };
    } else if (providerId === 'anthropic') {
      const res = await fetch('/api/anthropic-completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      const output = data.content || data.messages?.[0]?.content || '';
      const latency = Date.now() - start;
      // Anthropic usage: { input_tokens, output_tokens }
      const usage = data.usage || null;
      const cost = usage ? estimateAnthropicCost(model, usage) : null;
      return { output, latency, usage, cost, totalTokens: usage?.input_tokens && usage?.output_tokens ? usage.input_tokens + usage.output_tokens : null };
    } else if (providerId === 'together') {
      const res = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024
        })
      });
      const data = await res.json();
      const output = data.choices?.[0]?.message?.content || '';
      const latency = Date.now() - start;
      // Together API is OpenAI-compatible in usage if present
      const usage = data.usage || null;
      const cost = usage ? estimateOpenAICost(model, usage) : null;
      return { output, latency, usage, cost, totalTokens: usage?.total_tokens ?? null };
    } else if (providerId === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024
        })
      });
      const data = await res.json();
      const output = data.choices?.[0]?.message?.content || '';
      const latency = Date.now() - start;
      const usage = data.usage || null;
      const cost = usage ? estimateGroqCost(model, usage) : null;
      return { output, latency, usage, cost, totalTokens: usage?.total_tokens ?? null };
    } else if (providerId === 'azure') {
      // Call our own Next.js API route for Azure
      const res = await fetch('/api/azure-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey,
          endpoint,
          model,
          prompt
        })
      });
      const data = await res.json();
      const output = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
      const latency = Date.now() - start;
      // Azure OpenAI returns usage like OpenAI
      const usage = data.usage || null;
      const cost = usage ? estimateOpenAICost(model, usage) : null;
      return { output, latency, usage, cost, totalTokens: usage?.total_tokens ?? null };
    } else if (providerId === 'google') {
      // Instead of calling Google directly, call our own Next.js API route
      url = '/api/google-gemini';
      headers = {
        'Content-Type': 'application/json'
      };
      body = {
        apiKey,
        model,
        prompt
      };
    } else if (providerId === 'fireworks') {
      // Choose endpoint based on model type
      const isChatModel = /chat/i.test(model);
      url = isChatModel
        ? 'https://api.fireworks.ai/inference/v1/chat/completions'
        : 'https://api.fireworks.ai/inference/v1/completions';
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (isChatModel) {
        body = {
          model,
          max_tokens: 1024,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.6,
          messages: [
            { role: 'user', content: prompt }
          ]
        };
      } else {
        body = {
          model,
          max_tokens: 1024,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.6,
          prompt
        };
      }
    } else {
      return { output: null, latency: null, error: 'Provider not supported yet.' };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      return { output: null, latency: null, error: `HTTP ${res.status}: ${await res.text()}` };
    }

    const data = await res.json();
    let output = '';
    const latency = Date.now() - start;

    // Output extraction logic per provider
    if (providerId === 'openai' || providerId === 'groq' || providerId === 'azure') {
      output = data.choices?.[0]?.message?.content ?? '';
    } else if (providerId === 'fireworks') {
      if (data.choices?.[0]?.message?.content !== undefined) {
        output = data.choices[0].message.content;
      } else if (data.choices?.[0]?.text !== undefined) {
        output = data.choices[0].text;
      } else {
        output = '';
      }
    } else if (providerId === 'google') {
      output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }

    // Token usage and cost estimation
    if (providerId === 'openai' && data.usage) {
      totalTokens = data.usage.total_tokens ?? null;
      // Cost estimation (very rough, assumes all tokens are output)
      const pricing = OPENAI_PRICING[model] || { input: 0.0, output: 0.0 };
      const inputTokens = data.usage.prompt_tokens ?? 0;
      const outputTokens = data.usage.completion_tokens ?? 0;
      costUsd = ((inputTokens / 1000) * pricing.input) + ((outputTokens / 1000) * pricing.output);
    } else if (providerId === 'groq' && data.usage) {
      totalTokens = data.usage.total_tokens ?? null;
      // Groq: one price per token for now
      const pricePer1k = GROQ_PRICING[model] || 0.0008;
      costUsd = totalTokens ? (pricePer1k * totalTokens / 1000) : null;
    }

    return { output, latency, totalTokens, costUsd };
  } catch (err: any) {
    // Enhanced error logging for debugging
    console.error('Model API error:', err);
    if (typeof window !== 'undefined') {
      alert('Model API error: ' + (err?.message || JSON.stringify(err)));
    }
    return { output: null, latency: null, error: err?.message || 'Unknown error' };
  }
}

// --- Cost estimation helpers ---
function estimateOpenAICost(model: string, usage: any): number | null {
  // Fill in per-model pricing as needed
  // Example: $0.002 / 1K tokens
  if (!usage?.total_tokens) return null;
  return (usage.total_tokens / 1000) * 0.002;
}
function estimateAnthropicCost(model: string, usage: any): number | null {
  // Fill in per-model pricing as needed
  // Example: $0.008 / 1K input, $0.024 / 1K output
  if (!usage?.input_tokens || !usage?.output_tokens) return null;
  return (usage.input_tokens / 1000) * 0.008 + (usage.output_tokens / 1000) * 0.024;
}
function estimateGroqCost(model: string, usage: any): number | null {
  // Fill in per-model pricing as needed
  if (!usage?.total_tokens) return null;
  return (usage.total_tokens / 1000) * 0.002;
}
