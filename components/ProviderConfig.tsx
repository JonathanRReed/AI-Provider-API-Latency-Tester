import type { ProviderConfig } from '../utils/providers';
import React, { useEffect, useRef, useState } from 'react';
import { fetchModels } from '../utils/fetchModels';
import { PROVIDERS } from '../utils/providers';

// Providers that allow public model listing (no API key required)
const PUBLIC_MODEL_PROVIDERS = PROVIDERS.filter(p => !p.requiresApiKey).map(p => p.id);

// In-memory cache for (provider, apiKey) => models
const modelCache: Record<string, string[]> = {};

function getCacheKey(provider: string, apiKey: string, endpoint?: string) {
  return `${provider}::${apiKey}::${endpoint || ''}`;
}

interface ModelState {
  loading: boolean;
  error: string | null;
  models: string[];
}

export interface ProviderBlock {
  id: number;
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string; // Azure only
  deploymentName?: string; // Azure only
}

export default function ProviderConfig({ blocks, onUpdate, onAdd, onRemove }: {
  blocks: ProviderBlock[];
  onUpdate: (id: number, field: keyof ProviderBlock, value: string) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}) {
  const [modelStates, setModelStates] = useState<Record<number, ModelState>>({});
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});

  useEffect(() => {
    blocks.forEach((block) => {
      const prev = modelStates[block.id];
      const cacheKey = getCacheKey(block.provider, block.apiKey, block.endpoint);
      // Special dynamic fetch for Gemini
      if (block.provider === 'google' && block.apiKey) {
        setModelStates((s) => ({ ...s, [block.id]: { loading: true, error: null, models: [] } }));
        fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${block.apiKey}`)
          .then(async res => {
            if (!res.ok) throw new Error('Failed to fetch Gemini models');
            const data = await res.json();
            const models = Array.isArray(data.models)
              ? data.models.map((m: any) => m.name).filter((id: string) => id.startsWith('models/gemini-'))
              : [];
            setModelStates((s) => ({ ...s, [block.id]: { loading: false, error: null, models } }));
            if (!block.model && models.length > 0) {
              onUpdate(block.id, 'model', models[0]);
            }
          })
          .catch(err => {
            setModelStates((s) => ({ ...s, [block.id]: { loading: false, error: err?.message || 'Failed to fetch models', models: [] } }));
          });
        return;
      }
      // Standard model fetch for others
      if (modelCache[cacheKey]) {
        if (!prev || prev.models !== modelCache[cacheKey]) {
          setModelStates((s) => ({
            ...s,
            [block.id]: {
              loading: false,
              error: null,
              models: modelCache[cacheKey],
            },
          }));
        }
        return;
      }
      if (debounceTimers.current[block.id]) {
        clearTimeout(debounceTimers.current[block.id]);
      }
      setModelStates((s) => ({
        ...s,
        [block.id]: { loading: true, error: null, models: [] },
      }));
      debounceTimers.current[block.id] = setTimeout(async () => {
        try {
          const models = await fetchModels(block.provider, block.apiKey, block.endpoint);
          modelCache[cacheKey] = models;
          setModelStates((s) => ({
            ...s,
            [block.id]: { loading: false, error: null, models },
          }));
          if (!block.model && models.length > 0) {
            onUpdate(block.id, 'model', models[0]);
          }
        } catch (err: any) {
          setModelStates((s) => ({
            ...s,
            [block.id]: { loading: false, error: err?.message || 'Failed to fetch models', models: [] },
          }));
        }
      }, 400);
    });
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks.map(b => `${b.provider}:${b.apiKey}:${b.endpoint || ''}`).join('|')]);

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        const providerMeta = PROVIDERS.find(p => p.id === block.provider);
        const modelState = modelStates[block.id] || { loading: false, error: null, models: [] };
        return (
          <div
            key={block.id}
            className="rounded-2xl border-2 border-cyan-400/70 bg-black/10 backdrop-blur-md shadow-[0_0_32px_8px_rgba(0,255,247,0.28)] p-6 md:p-8 transition-all duration-200 hover:shadow-[0_0_32px_8px_rgba(0,255,247,0.45)] hover:ring-4 hover:ring-cyan-300/90 focus-within:ring-4 focus-within:ring-cyan-300/90"
          >
            <div className="flex gap-2 items-center">
              <select
                value={block.provider}
                onChange={e => onUpdate(block.id, 'provider', e.target.value)}
                className="bg-oled border border-cyan rounded px-2 py-1 text-text"
                aria-label="Select provider"
              >
                {PROVIDERS.map(p => (
                  <option key={p.id} value={p.id}>{p.displayName}</option>
                ))}
              </select>
              <button onClick={() => onRemove(block.id)} className="ml-auto text-cyan hover:text-magenta transition font-bold" aria-label="Remove provider block">✕</button>
            </div>
            {/* Azure: Always show API key, endpoint, and deployment name fields stacked vertically */}
            {block.provider === 'azure' ? (
              <>
                <input
                  type="text"
                  value={block.apiKey}
                  onChange={e => onUpdate(block.id, 'apiKey', e.target.value)}
                  placeholder="API Key"
                  className="w-full bg-oled border border-cyan rounded px-2 py-1 text-text mb-2"
                  aria-label="API Key"
                  autoComplete="off"
                />
                <input
                  type="text"
                  value={block.endpoint || ''}
                  onChange={e => onUpdate(block.id, 'endpoint', e.target.value)}
                  placeholder="Azure Endpoint (e.g. https://YOUR-RESOURCE-NAME.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT)"
                  className="w-full bg-oled border border-cyan rounded px-2 py-1 text-text mb-1"
                  aria-label="Azure Endpoint"
                  autoComplete="off"
                />
                <div className="text-xs text-cyan-300 mb-2">
                  Enter your Azure OpenAI endpoint up to <b>/openai/deployments/&lt;deployment&gt;</b> (no trailing slash, no /chat/completions, no ?api-version=...)
                </div>
                <input
                  type="text"
                  value={block.model || ''}
                  onChange={e => onUpdate(block.id, 'model', e.target.value)}
                  placeholder="Model name (e.g. gpt-4o, gpt-4, gpt-35-turbo)"
                  className="w-full bg-oled border border-cyan rounded px-2 py-1 text-text mb-1"
                  aria-label="Azure Model Name"
                  autoComplete="off"
                />
                <div className="text-xs text-cyan-300 mb-2">
                  Enter the <b>model name</b> (e.g. gpt-4o, gpt-4, gpt-35-turbo). This is NOT your deployment name.
                </div>
              </>
            ) : (
              providerMeta?.requiresApiKey && (
                <input
                  type="text"
                  value={block.apiKey}
                  onChange={e => onUpdate(block.id, 'apiKey', e.target.value)}
                  placeholder="API Key"
                  className="w-full bg-oled border border-cyan rounded px-2 py-1 text-text"
                  aria-label="API Key"
                  autoComplete="off"
                />
              )
            )}
            {/* Only show model dropdown if NOT Azure or Fireworks */}
            {block.provider !== 'azure' && block.provider !== 'fireworks' && (
              <div>
                <label className="block mb-1 text-sm">Model</label>
                <select
                  value={block.model}
                  onChange={e => onUpdate(block.id, 'model', e.target.value)}
                  className="w-full bg-oled border border-cyan rounded px-2 py-1 text-text"
                  disabled={modelState.loading || modelState.models.length === 0}
                  aria-label="Select model"
                >
                  {modelState.loading && <option>Loading models...</option>}
                  {!modelState.loading && modelState.models.length === 0 && <option>No models available</option>}
                  {!modelState.loading && modelState.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {modelState.error && (
                  <div className="text-yellow text-xs mt-1">{modelState.error}</div>
                )}
              </div>
            )}
            {/* Fireworks: manual model entry if none fetched */}
            {block.provider === 'fireworks' && (
              <div>
                <label className="block mb-1 text-sm">Fireworks Model ID</label>
                <input
                  type="text"
                  value={block.model || ''}
                  onChange={e => onUpdate(block.id, 'model', e.target.value)}
                  placeholder="accounts/your-account-id/deployedModels/your-model-id"
                  className="w-full bg-oled border border-cyan rounded px-2 py-1 text-text mb-1"
                  aria-label="Fireworks Model ID"
                  autoComplete="off"
                />
                <div className="text-xs text-cyan-300 mb-2">
                  Enter your full deployed model ID from the Fireworks dashboard.<br />
                  Example: <b>accounts/your-account-id/deployedModels/your-model-id</b>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <button onClick={onAdd} className="glass-button bg-cyan text-oled px-4 py-2 rounded font-semibold hover:bg-magenta transition">
        + Add Provider
      </button>
    </div>
  );
}
