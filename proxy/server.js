import { readFileSync } from 'fs';
import express from 'express';
import cors from 'cors';

// Load .env manually (no dotenv dependency needed)
try {
  const env = readFileSync(new URL('.env', import.meta.url), 'utf-8');
  for (const line of env.split('\n')) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.+)\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
} catch {
  // .env file is optional if vars are set in the environment
}

const API_KEY = process.env.PLANTNET_API_KEY;
const PORT = process.env.PORT || 3000;
const PLANTNET_URL = 'https://my-api.plantnet.org/v2/identify/all';

if (!API_KEY) {
  console.error('PLANTNET_API_KEY is not set. Create a .env file (see .env.example).');
  process.exit(1);
}

const app = express();
app.use(cors());

// Forward multipart form data directly to Pl@ntNet
app.post('/identify', async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const url = `${PLANTNET_URL}?api-key=${API_KEY}&lang=${lang}&nb-results=3`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // Forward content-type with boundary from the client
        'content-type': req.headers['content-type'],
      },
      body: req,
      duplex: 'half',
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Identification failed' });
    }

    // Return a slim response — only what the frontend needs
    const results = (data.results || []).slice(0, 3).map((r) => ({
      name: r.species?.scientificNameWithoutAuthor || '',
      commonNames: r.species?.commonNames || [],
      score: Math.round((r.score || 0) * 100),
    }));

    res.json({
      bestMatch: data.bestMatch || '',
      results,
      remaining: data.remainingIdentificationRequests,
    });
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'Failed to reach identification service' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT}`);
});
