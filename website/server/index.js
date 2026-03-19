import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_FILE = join(__dirname, 'subscribers.json');
const PORT = process.env.PORT || 4000;

// ── Helpers ──────────────────────────────────────────

function loadSubscribers() {
  if (!existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSubscribers(list) {
  writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

// ── App ──────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (index.html, style.css, images)
app.use(express.static(ROOT, { extensions: ['html'] }));

// Subscribe endpoint
app.post('/api/subscribe', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const subscribers = loadSubscribers();
  const exists = subscribers.some((s) => s.email === email);

  if (exists) {
    return res.json({ ok: true, message: 'Already subscribed.' });
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  saveSubscribers(subscribers);

  console.log(`New subscriber: ${email} (total: ${subscribers.length})`);
  res.status(201).json({ ok: true, message: 'Subscribed!' });
});

// List subscribers (basic admin — protect in production)
app.get('/api/subscribers', (_req, res) => {
  const subscribers = loadSubscribers();
  res.json({ count: subscribers.length, subscribers });
});

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Website running at http://localhost:${PORT}`);
});
