# omm-plants proxy

Lightweight Express server that sits between the PWA frontend and the [Pl@ntNet API](https://my.plantnet.org). It keeps the API key on the server so it is never exposed in client-side code.

## How it works

```
┌──────────┐        POST /identify        ┌───────────┐       POST + api-key       ┌───────────┐
│  Browser  │ ──────────────────────────▶  │   Proxy   │ ────────────────────────▶  │  Pl@ntNet │
│  (PWA)    │ ◀──────────────────────────  │  :3000    │ ◀────────────────────────  │   API     │
└──────────┘    slim JSON response        └───────────┘     full JSON response     └───────────┘
```

The frontend sends the plant photo as multipart form data. The proxy appends the API key and forwards the request to Pl@ntNet. It then returns only the fields the app needs (`name`, `commonNames`, `score`), keeping the response small.

## Setup

```bash
cd proxy
cp .env.example .env     # then paste your Pl@ntNet API key
npm install
npm start                # http://localhost:3000
```

Get a free API key at https://my.plantnet.org (500 identifications/day).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/identify?lang=en` | Identify a plant. Send multipart form data with an `images` field (JPEG/PNG) and an `organs` field (`auto`, `leaf`, `flower`, `fruit`, `bark`). |
| GET | `/health` | Health check. Returns `{ "ok": true }`. |

## Hosting

The proxy is a single `server.js` file with two dependencies (`express`, `cors`). It runs anywhere Node 20+ is available.

### Option 1 — VPS / Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js .
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
```

Set `PLANTNET_API_KEY` as an environment variable on the host or in your Docker Compose / Kubernetes config. Do **not** bake the key into the image.

```bash
docker build -t omm-proxy .
docker run -d -p 3000:3000 -e PLANTNET_API_KEY=your-key omm-proxy
```

### Option 2 — Railway / Render / Fly.io

1. Point the service at the `proxy/` directory (or set it as the root).
2. Build command: `npm install`
3. Start command: `npm start`
4. Add `PLANTNET_API_KEY` as a secret/environment variable in the dashboard.

All three platforms have free tiers that are sufficient for this use case.

### Option 3 — Serverless (Vercel / Netlify Functions)

Wrap the `/identify` handler in a serverless function. Example for Vercel:

```js
// api/identify.js
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}&lang=${req.query.lang || 'en'}&nb-results=3`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': req.headers['content-type'] },
    body: req,
    duplex: 'half',
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
```

Set `PLANTNET_API_KEY` in the project's environment variables.

### After deploying

Update the proxy URL in the frontend:

```
src/app/services/plant-id.service.ts
```

Change `PROXY_URL` from `http://localhost:3000` to your deployed URL (e.g. `https://omm-proxy.fly.dev`).
