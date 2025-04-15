import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept API key from header, query param, or body
  let apiKey = '';
  if (req.headers['authorization']) {
    apiKey = String(req.headers['authorization']).replace('Bearer ', '');
  } else if (req.query.apiKey) {
    apiKey = String(req.query.apiKey);
  } else if (req.body && req.body.apiKey) {
    apiKey = String(req.body.apiKey);
  }
  if (!apiKey) {
    res.status(401).json({ error: 'Missing API key' });
    return;
  }
  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
    const data = await anthropicRes.json();
    res.status(anthropicRes.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}
