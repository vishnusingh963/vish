# ScamShield

Paste a text, email, or DM and get an AI-powered risk score before you click
anything. Built with React, Vite, Ant Design, and the Gemini API.

## Requirements

- [Node.js](https://nodejs.org) 18 or newer (`node -v` to check)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env
# then open .env and paste your key after GEMINI_API_KEY=
```

## Run it

You need **two terminals** open at the same time — one for the frontend, one
for the backend that talks to Gemini:

```bash
# Terminal 1 — the API backend (port 4173)
npm run server

# Terminal 2 — the app itself (port 5173)
npm run dev
```

Open **http://localhost:5173** in your browser. Paste a suspicious message
into the scanner and click "Run Scan".

If the backend isn't running (or the API key is missing/invalid), the scanner
still works using a built-in offline keyword check as a fallback — you just
won't get real AI reasoning.

## Project structure

```
index.html        Vite entry point
src/               React app (App.jsx, Scanner.jsx, theme, animations)
api/scan.js        Serverless function that calls Gemini (used by both
                   the local dev server and Vercel in production)
server.js          Local stand-in for api/scan.js during development
```

## Deploying

### 1. Push the code to GitHub

Check you have git first: `git --version`. If that fails, install it:

- **macOS**: `xcode-select --install` (if you already have Xcode Command Line
  Tools but see a license error instead, run `sudo xcodebuild -license` and
  accept it)
- **Windows**: download and run the installer from [git-scm.com](https://git-scm.com/download/win)
- **Linux (Debian/Ubuntu)**: `sudo apt install git`
- **Linux (Fedora)**: `sudo dnf install git`

Then:
```bash
git init
git add -A
git commit -m "Initial commit"
```

Create a new empty repository on [github.com/new](https://github.com/new)
(don't add a README/gitignore there, you already have them), then:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

`.env` (your real API key) is already excluded via `.gitignore`, so it will
never be pushed — only the empty `.env.example` is tracked.

### 2. Import the repo on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (GitHub login
   is easiest).
2. Click **Import** next to the repo you just pushed.
3. Vercel auto-detects the Vite framework — leave the build settings as
   they are (Build Command `vite build`, Output Directory `dist`).
4. Before clicking Deploy, open **Environment Variables** and add:
   - Key: `GEMINI_API_KEY`
   - Value: your real Gemini key (from [Google AI Studio](https://aistudio.google.com/app/apikey))
   - Environment: select all three (Production, Preview, Development)
5. Click **Deploy**.

### 3. Verify

Once it's live, open the deployed URL and run a scan. If you forgot to set
the environment variable, `/api/scan` will return a 500 — go to
**Project → Settings → Environment Variables**, add it there, then
**Deployments → ⋯ → Redeploy** for it to take effect.