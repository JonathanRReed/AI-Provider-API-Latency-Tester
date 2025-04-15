import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = (req.headers['authorization']?.replace('Bearer ', '') || req.body.apiKey) as string;
  if (!apiKey) {
    res.status(401).json({ error: 'Missing API key' });
    return;
  }
  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await anthropicRes.json();
    res.status(anthropicRes.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}
