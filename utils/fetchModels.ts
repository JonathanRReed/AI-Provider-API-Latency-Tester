// Utility to fetch available model names for each provider
// Centralized approach: use provider config
import { getProviderById } from './providers';

export async function fetchModels(providerId: string, apiKey: string, endpoint?: string): Promise<string[]> {
  const provider = getProviderById(providerId);
  if (!provider || !provider.fetcher) return [];
  try {
    // Pass endpoint for Azure
    if (providerId === 'azure') {
      return await provider.fetcher(apiKey, endpoint);
    }
    return await provider.fetcher(apiKey);
  } catch (e) {
    // Ignore error, return empty
  }
  return [];
}

// Export provider-specific fetchers for provider config
export async function fetchOpenAIModels(apiKey: string): Promise<string[]> {
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  if (!res.ok) throw new Error('OpenAI model fetch failed');
  const data = await res.json();
  return data.data
    .map((m: any) => m.id)
    .filter((id: string) => id.startsWith('gpt-'));
}

export async function fetchGroqModels(apiKey: string): Promise<string[]> {
  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  if (!res.ok) throw new Error('Groq model fetch failed');
  const data = await res.json();
  return data.data.map((m: any) => m.id);
}

export async function fetchAnthropicModels(apiKey: string): Promise<string[]> {
  const res = await fetch('/api/anthropic-models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  if (!res.ok) throw new Error('Anthropic model fetch failed');
  const data = await res.json();
  return data.data.map((m: any) => m.id);
}

export async function fetchGoogleModels(apiKey: string): Promise<string[]> {
  // As of 2025, Gemini API does not provide a public endpoint for model listing.
  // If you have a Gemini API key, you must know the model name (e.g., 'gemini-pro', 'gemini-1.5-pro').
  // See https://ai.google.dev/gemini-api/docs/models for details.
  return [];
}

export async function fetchAzureModels(apiKey: string, endpoint?: string): Promise<string[]> {
  // Azure OpenAI does not have a public endpoint for listing models.
  // You must know the deployment name (model name) configured in your Azure portal.
  // See https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource for details.
  // Optionally, you could allow manual entry.
  return [];
}

export async function fetchOpenRouterModels(apiKey: string): Promise<string[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  if (!res.ok) throw new Error('OpenRouter model fetch failed');
  const data = await res.json();
  return data.data.map((m: any) => m.id);
}

// --- BEGIN PATCH: Add Fireworks Model Fetcher ---
export async function fetchFireworksModels(apiKey: string): Promise<string[]> {
  const res = await fetch('https://api.fireworks.ai/inference/v1/models', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  if (!res.ok) throw new Error('Fireworks model fetch failed');
  const data = await res.json();
  // Fireworks returns { data: [{ id: ... }, ...] }
  return data.data.map((m: any) => m.id);
}
// --- END PATCH ---

// --- BEGIN PATCH: Together AI Types and Inference ---
// TogetherModel: Structure of a model from Together AI
export interface TogetherModel {
  id: string;
  object: string;
  owned_by?: string;
  permission?: any[];
  // Add more fields as needed
}

// Fetch models from Together AI with typing and error handling
export async function fetchTogetherModels(apiKey: string): Promise<string[]> {
  console.log('[TogetherAI] fetchTogetherModels called with apiKey:', apiKey ? '[REDACTED]' : '[EMPTY]');
  try {
    const res = await fetch('https://api.together.xyz/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    console.log('[TogetherAI] Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[TogetherAI] Model fetch failed:', errorText);
      throw new Error('Together AI model fetch failed: ' + errorText);
    }
    const data = await res.json();
    console.log('[TogetherAI] Raw model response:', data);
    if (!Array.isArray(data)) throw new Error('Malformed Together AI model response');
    return data.map((m: TogetherModel) => m.id);
  } catch (err) {
    console.error('[TogetherAI] fetchTogetherModels error:', err);
    throw err;
  }
}

// Perform inference using Together AI /chat/completions endpoint
export async function performTogetherInference({
  apiKey,
  model,
  messages
}: {
  apiKey: string;
  model: string;
  messages: { role: string; content: string }[];
}): Promise<string> {
  // Heuristic: treat models as chat if name contains 'chat', 'instruct', or 'mistral-large', else completion
  const isChatModel = /chat|instruct|mistral-large|llama-3-70b|llama-3-8b|llama-2-70b-chat|llama-2-13b-chat|llama-2-7b-chat/i.test(model);
  let url, payload;
  if (isChatModel) {
    url = 'https://api.together.xyz/v1/chat/completions';
    payload = { model, messages };
  } else {
    url = 'https://api.together.xyz/v1/completions';
    payload = { model, prompt: messages[0]?.content || '' };
  }
  console.log('[TogetherAI] Inference endpoint:', url);
  console.log('[TogetherAI] Inference payload:', payload);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Together AI inference failed');
  const data = await res.json();
  // Response extraction
  if (isChatModel) {
    if (!data.choices || !data.choices[0]?.message?.content) throw new Error('Malformed Together AI chat response');
    return data.choices[0].message.content;
  } else {
    if (!data.choices || !data.choices[0]?.text) throw new Error('Malformed Together AI completion response');
    return data.choices[0].text;
  }
}
// --- END PATCH ---
