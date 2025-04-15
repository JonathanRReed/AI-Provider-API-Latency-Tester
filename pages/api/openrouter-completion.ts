import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenRouterModelInfo } from '../../utils/openrouterModelInfo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, model, prompt, max_tokens = 1024 } = req.body;
  if (!apiKey || !model || !prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const backendStart = Date.now();
    const completionRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens,
      }),
    });
    const completionData = await completionRes.json();
    const output = completionData.choices?.[0]?.message?.content || '';
    const id = completionData.id;
    const provider = completionData.provider || null;
    const modelName = completionData.model || model;
    let usage = null;
    let statsUnavailable = false;
    let contextLength = null;
    let pricing = null;
    // Try to get stats from OpenRouter
    if (id) {
      try {
        const statsRes = await fetch(`https://openrouter.ai/api/v1/generation/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        let statsText = await statsRes.text();
        if (statsRes.ok) {
          const stats = JSON.parse(statsText);
          usage = {
            input_tokens: stats.input_tokens,
            output_tokens: stats.output_tokens,
            total_tokens: stats.total_tokens,
          };
        } else {
          statsUnavailable = true;
        }
      } catch (err) {
        statsUnavailable = true;
      }
    } else {
      statsUnavailable = true;
    }
    // Fallback: use backend wall time
    if (statsUnavailable) {
      try {
        const modelInfoLookup = await getOpenRouterModelInfo();
        const modelMeta = modelInfoLookup[modelName];
        if (modelMeta) {
          contextLength = modelMeta.context_length || null;
          pricing = modelMeta.pricing || null;
        }
      } catch (err) {}
    }
    res.status(200).json({ output, usage, contextLength, pricing, statsUnavailable, provider, model });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from OpenRouter' });
  }
}
