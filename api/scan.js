// Vercel serverless function: proxies the scam-check request to Gemini
// so the API key never reaches the browser. Node 18+ runtime (global fetch).

const MODEL = 'gemini-3.5-flash-lite';
const MAX_INPUT_CHARS = 2000;

const SYSTEM_PROMPT =
  'You are a fraud analyst. Read the message and decide if it is a scam. ' +
  'Score risk 0-100 (0=safe, 100=certain scam). Give at most 4 short, ' +
  'plain-English reasons (max 8 words each). No greetings, no extra text.';

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    score: { type: 'INTEGER' },
    verdict: { type: 'STRING', enum: ['LOW', 'HIGH'] },
    reasons: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      maxItems: 4,
    },
  },
  required: ['score', 'verdict', 'reasons'],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    return;
  }

  const message = (req.body && req.body.message ? String(req.body.message) : '').trim();
  if (!message) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const text = message.slice(0, MAX_INPUT_CHARS);

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 200,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      res.status(502).json({ error: 'Gemini request failed', detail: errBody });
      return;
    }

    const data = await geminiRes.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      res.status(502).json({ error: 'Empty response from Gemini' });
      return;
    }

    const parsed = JSON.parse(raw);
    res.status(200).json({
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      verdict: parsed.verdict === 'HIGH' ? 'HIGH' : 'LOW',
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons.slice(0, 4) : [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Scan failed', detail: String(err) });
  }
}
