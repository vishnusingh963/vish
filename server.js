// Local API server for dev: runs api/scan.js so Vite (npm run dev) can proxy
// /api/scan to it. Not used in production — Vercel runs api/scan.js directly.
// Run: npm run server  (reads GEMINI_API_KEY from .env automatically)

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const { default: scanHandler } = await import('./api/scan.js');
const PORT = process.env.PORT || 4173;

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/scan') {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', async () => {
      try {
        req.body = raw ? JSON.parse(raw) : {};
      } catch {
        req.body = {};
      }
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (obj) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
      };
      await scanHandler(req, res);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found — this server only handles POST /api/scan. The app itself is at http://localhost:5173');
});

server.listen(PORT, () => {
  console.log(`ScamShield API running at http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY not set — /api/scan will return 500 until it is.');
  }
});
