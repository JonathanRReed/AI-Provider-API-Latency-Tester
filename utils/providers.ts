// Centralized provider config for model fetching and display
// Add new providers here for easy extensibility

import { fetchOpenAIModels, fetchGroqModels, fetchAnthropicModels, fetchGoogleModels, fetchAzureModels, fetchOpenRouterModels, fetchFireworksModels, fetchTogetherModels } from './fetchModels';

export interface ProviderConfig {
  id: string;
  displayName: string;
  requiresApiKey: boolean;
  fetcher?: (apiKey: string, endpoint?: string) => Promise<string[]>;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    displayName: 'OpenAI',
    requiresApiKey: true,
    fetcher: fetchOpenAIModels,
  },
  {
    id: 'groq',
    displayName: 'Groq',
    requiresApiKey: true,
    fetcher: fetchGroqModels,
  },
  {
    id: 'fireworks',
    displayName: 'Fireworks',
    requiresApiKey: true,
    fetcher: fetchFireworksModels,
  },
  {
    id: 'together',
    displayName: 'Together',
    requiresApiKey: true,
    fetcher: fetchTogetherModels,
  },
  {
    id: 'azure',
    displayName: 'Azure OpenAI',
    requiresApiKey: true,
    fetcher: fetchAzureModels, // always returns []
  },
  {
    id: 'anthropic',
    displayName: 'Anthropic',
    requiresApiKey: true,
    fetcher: fetchAnthropicModels,
  },
  {
    id: 'google',
    displayName: 'Google Gemini',
    requiresApiKey: true,
    fetcher: fetchGoogleModels, // always returns []
  },
  {
    id: 'openrouter',
    displayName: 'OpenRouter',
    requiresApiKey: true,
    fetcher: fetchOpenRouterModels,
  },
];

export function getProviderById(id: string): ProviderConfig | undefined {
  return PROVIDERS.find(p => p.id === id);
}
