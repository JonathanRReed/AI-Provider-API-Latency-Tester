import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { apiKey, endpoint, model, prompt, system, max_tokens, temperature, top_p } = req.body;

  // Debug logging: print received fields
  console.log('Azure API route received:', { apiKey: !!apiKey, endpoint, model, prompt, system, max_tokens, temperature, top_p });

  if (!apiKey || !endpoint || !model || !prompt) {
    res.status(400).json({ error: 'Missing required fields', debug: { apiKey: !!apiKey, endpoint, model, prompt } });
    return;
  }

  // --- BEGIN PATCH: Endpoint Sanitization ---
  // Remove query params and /chat/completions if user included them
  let endpointOnly = endpoint.split('?')[0];
  if (endpointOnly.endsWith('/chat/completions')) {
    endpointOnly = endpointOnly.slice(0, -'/chat/completions'.length);
  }
  // Remove trailing slash for consistency
  endpointOnly = endpointOnly.endsWith('/') ? endpointOnly.slice(0, -1) : endpointOnly;

  if (!endpointOnly.includes('/openai/deployments/')) {
    res.status(400).json({
      error: 'Malformed Azure endpoint: must include /openai/deployments/<deployment>',
      hint: 'Example: https://YOUR-RESOURCE-NAME.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT',
      debug: { endpoint }
    });
    return;
  }

  // Now build the correct URL
  let url = endpointOnly + '/chat/completions';
  const urlObj = new URL(url);
  if (!urlObj.searchParams.has('api-version')) {
    urlObj.searchParams.set('api-version', '2024-12-01-preview');
  }
  url = urlObj.toString();
  // --- END PATCH ---

  // Build messages array as in Python example
  const messages = [];
  if (system) {
    messages.push({ role: 'system', content: system });
  }
  messages.push({ role: 'user', content: prompt });

  const body: any = {
    messages,
    model,
  };
  if (max_tokens !== undefined) body.max_tokens = max_tokens;
  if (temperature !== undefined) body.temperature = temperature;
  if (top_p !== undefined) body.top_p = top_p;

  // Debug: log final URL and body before fetch
  console.log('[Azure API DEBUG] Final URL:', url);
  console.log('[Azure API DEBUG] Request body:', body);

  try {
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const text = await apiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      res.status(apiRes.status).json({ error: `Azure API returned non-JSON: ${text}`, debug: { url, body, status: apiRes.status } });
      return;
    }
    res.status(apiRes.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unknown error', debug: { url, body } });
  }
}
