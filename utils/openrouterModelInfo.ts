// Utility to fetch and cache OpenRouter model metadata (pricing, context length, etc.)

let modelInfoCache: Record<string, any> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 1000 * 60 * 10; // 10 minutes

export async function getOpenRouterModelInfo(): Promise<Record<string, any>> {
  const now = Date.now();
  if (modelInfoCache && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION_MS) {
    return modelInfoCache;
  }
  const res = await fetch('https://openrouter.ai/api/v1/models');
  if (!res.ok) throw new Error('Failed to fetch OpenRouter models');
  const data = await res.json();
  // Build a lookup by model id
  const lookup: Record<string, any> = {};
  if (Array.isArray(data.data)) {
    for (const model of data.data) {
      lookup[model.id] = model;
    }
  }
  modelInfoCache = lookup;
  cacheTimestamp = now;
  return lookup;
}
