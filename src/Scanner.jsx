import { useEffect, useState } from 'react';
import { Card, Input, Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { colors } from './theme.js';

const RULES = [
  { re: /\b(verify|confirm|update)\s+your\s+(account|identity|password|details)\b/i, points: 22, label: 'Asks you to "verify" account details' },
  { re: /\b(suspend|suspended|locked|deactivat\w*|closed?)\b.*\b(account|access)\b/i, points: 20, label: 'Threatens account suspension' },
  { re: /\b(within|in)\s+\d+\s*(hours?|minutes?|days?)\b/i, points: 16, label: 'Manufactured time pressure' },
  { re: /\b(won|winner|prize|claim your|reward|gift\s*card)\b/i, points: 20, label: 'Prize or reward bait' },
  { re: /\b(otp|one[\s-]?time\s+(code|password)|verification\s+code)\b/i, points: 18, label: 'Requests a one-time code' },
  { re: /\b(click|tap)\s+(here|this\s+link|below)\b/i, points: 12, label: 'Generic "click here" prompt' },
  { re: /\b(wire|western\s+union|gift\s*cards?|crypto|bitcoin)\b.*\b(pay|send|transfer)\b|\b(pay|send|transfer)\b.*\b(wire|western\s+union|gift\s*cards?|crypto|bitcoin)\b/i, points: 24, label: 'Unusual payment method requested' },
  { re: /\b(irs|social\s+security|court|warrant|legal\s+action|arrest)\b/i, points: 18, label: 'Impersonates authority / legal threat' },
  { re: /(bit\.ly|tinyurl|t\.co|goo\.gl|[a-z0-9-]+\.(?:ru|tk|xyz|top))\b/i, points: 16, label: 'Shortened or unusual link domain' },
  { re: /\b(dear\s+customer|dear\s+user|valued\s+member)\b/i, points: 8, label: 'Generic greeting, no real name' },
];

const SCAN_PHASES = ['Reading message…', 'Checking links…', 'Cross-referencing scam patterns…', 'Scoring risk…'];
const MIN_SCAN_MS = 1500;

function analyzeLocally(text) {
  let score = 6;
  const flags = [];
  RULES.forEach((rule) => {
    if (rule.re.test(text)) {
      score += rule.points;
      flags.push(rule.label);
    }
  });
  const urlCount = (text.match(/https?:\/\/\S+/gi) || []).length;
  if (urlCount > 0 && flags.length === 0) {
    score += 6;
    flags.push('Contains a link — check the domain before clicking');
  }
  score = Math.max(2, Math.min(98, score));
  return { score, flags };
}

async function analyzeWithGemini(text) {
  const res = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
  if (!res.ok) throw new Error('scan request failed');
  const data = await res.json();
  return { score: data.score, flags: data.reasons };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Scanner() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!loading) return undefined;
    setPhase(0);
    const id = setInterval(() => setPhase((p) => (p + 1) % SCAN_PHASES.length), MIN_SCAN_MS / SCAN_PHASES.length);
    return () => clearInterval(id);
  }, [loading]);

  async function runScan() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const [data] = await Promise.all([analyzeWithGemini(trimmed), wait(MIN_SCAN_MS)]);
      setResult(data);
    } catch {
      await wait(MIN_SCAN_MS);
      setResult(analyzeLocally(trimmed));
    } finally {
      setLoading(false);
    }
  }

  const high = result && result.score >= 55;

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <div className="ticket-head">
        <span className="mono">EXHIBIT A — LIVE SCANNER</span>
        <span className="mono" style={{ color: colors.alert }}>
          <span className="live-dot" style={loading ? { animationDuration: '0.6s' } : undefined} />
          {loading ? 'SCANNING' : 'READY'}
        </span>
      </div>

      <div style={{ padding: 22 }}>
        <Typography.Text className="mono" style={{ fontSize: 12, color: colors.inkSoft, display: 'block', marginBottom: 8 }}>
          Paste the message
        </Typography.Text>

        <div className={`scan-target${loading ? ' is-scanning' : ''}`}>
          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder='e.g. "Your account will be suspended in 24 hours, verify now at..."'
            className="mono"
            style={{ fontSize: '0.85rem' }}
            disabled={loading}
          />
          {loading && <div className="scan-sweep" />}
        </div>

        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={runScan}
          style={{ marginTop: 14 }}
          icon={!loading && <ArrowRightOutlined />}
          iconPosition="end"
        >
          {loading ? 'Scanning' : 'Run Scan'}
        </Button>

        {loading && (
          <div className="mono scan-phase" key={phase}>
            {SCAN_PHASES[phase]}
          </div>
        )}

        {!loading && result && (
          <div
            className="fade-up verdict-panel"
            style={{
              marginTop: 18,
              border: `1px solid ${colors.lineStrong}`,
              padding: 16,
              background: high ? colors.alertBg : colors.safeBg,
              color: high ? colors.alert : colors.safe,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: '2rem', fontWeight: 600 }}>
                {result.score}
                <span style={{ fontSize: '1rem' }}>/100</span>
              </span>
              <span className="verdict-stamp">{high ? 'FLAGGED' : 'CLEAR'}</span>
            </div>

            <ul className="mono" style={{ marginTop: 12, fontSize: '0.76rem', color: colors.ink, listStyle: 'none', padding: 0 }}>
              {(result.flags && result.flags.length ? result.flags : ['No known scam patterns detected']).map((f, i) => (
                <li key={f} className="verdict-line" style={{ padding: '3px 0', animationDelay: `${0.15 + i * 0.08}s` }}>→ {f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
