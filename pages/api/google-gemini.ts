import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { apiKey, model, prompt } = req.body;
  if (!apiKey || !model || !prompt) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Ensure model does not have 'models/' prefix
  let cleanModel = model;
  if (cleanModel.startsWith('models/')) {
    cleanModel = cleanModel.replace(/^models\//, '');
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  // Log request details for debugging
  console.log('Google Gemini API call:', { url, body });

  try {
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await apiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      // Not valid JSON, forward as error with debug info
      res.status(apiRes.status).json({ error: `Google API returned non-JSON: ${text}`, debug: { url, body, status: apiRes.status } });
      return;
    }
    res.status(apiRes.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unknown error', debug: { url, body } });
  }
}
