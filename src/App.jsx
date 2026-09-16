import { Layout, Menu, Button, Row, Col, Statistic, Steps, Card, Tag, Typography } from 'antd';
import Scanner from './Scanner.jsx';
import Reveal from './Reveal.jsx';
import Counter from './Counter.jsx';
import { colors } from './theme.js';

const { Title, Paragraph, Text } = Typography;

const navItems = [
  { key: 'how', label: <a href="#how">How it Works</a> },
  { key: 'features', label: <a href="#features">Features</a> },
  { key: 'stack', label: <a href="#stack">Tech Stack</a> },
];

const steps = [
  { title: 'Paste content', description: "Drop in a message, email, or link you're unsure about." },
  { title: 'Text is analyzed', description: 'The AI scans wording, urgency cues and known scam patterns.' },
  { title: 'Link is checked', description: 'Any URL is compared against flagged and lookalike domains.' },
  { title: 'Risk score shown', description: 'A clear score and explanation tell you what to watch for.' },
];

const features = [
  { mark: '01 / MESSAGE', title: 'Message & email scan', text: 'Detects phishing language, fake urgency and impersonation attempts.' },
  { mark: '02 / LINK', title: 'Link safety check', text: 'Flags shortened, misspelled or suspicious URLs.' },
  { mark: '03 / SCORE', title: 'Plain-language risk score', text: 'A 0–100 score with a short explanation and no security jargon.' },
  { mark: '04 / SMS', title: 'SMS scam patterns', text: 'Detects common delivery, prize and OTP-scam message patterns.' },
  { mark: '05 / SPEED', title: 'Instant results', text: 'Fast analysis directly through the browser, powered by Gemini.' },
  { mark: '06 / PRIVACY', title: 'Privacy focused', text: 'Designed to minimize the handling and storage of submitted content.' },
];

const stack = ['Gemini API', 'React', 'Vite', 'Ant Design', 'Vercel Functions', 'Node.js'];

export default function App() {
  return (
    <Layout style={{ background: 'transparent' }}>
      <div className="hazard-rule" />

      <Layout.Header
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: colors.paper, borderBottom: `1px solid ${colors.lineStrong}`,
          height: 'auto', lineHeight: 'normal', padding: 0,
        }}
      >
        <nav className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: '1.2rem', color: colors.ink }}>
            <span style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.ink, color: colors.hazard, fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '0.8rem', transform: 'rotate(-2deg)' }}>
              SS
            </span>
            ScamShield
          </a>

          <Menu
            mode="horizontal"
            items={navItems}
            selectable={false}
            style={{ background: 'transparent', borderBottom: 'none', flex: 1, justifyContent: 'center', fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.82rem' }}
            className="mono"
          />

          <Button type="primary" href="#demo" className="mono">Scan a Message</Button>
        </nav>
      </Layout.Header>

      <Layout.Content>
        {/* HERO */}
        <section className="wrap" style={{ padding: '78px 28px 90px' }}>
          <Row gutter={[56, 40]} align="top" className="hero-grid">
            <Col xs={24} md={13}>
              <div className="fade-up mono" style={{ color: colors.alert, fontSize: '0.78rem', marginBottom: 22 }}>
                ■ AI-POWERED SCAM SCANNER
              </div>

              <Title className="fade-up" style={{ fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0, animationDelay: '0.05s' }}>
                Catch the scam<br />
                <span style={{ textDecoration: `underline ${colors.hazard}`, textDecorationThickness: 10, textUnderlineOffset: -4 }}>
                  before it catches you.
                </span>
              </Title>

              <Paragraph className="fade-up" style={{ marginTop: 26, maxWidth: 520, color: colors.inkSoft, fontSize: '1.06rem', animationDelay: '0.1s' }}>
                Paste a text, email or DM below. Our AI reads it like a fraud
                expert would, and points out the tricks, fake links and fake
                senders — before you tap anything.
              </Paragraph>

              <div className="fade-up" style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap', animationDelay: '0.15s' }}>
                <Button type="primary" size="large" href="#how" className="mono">See How it Works</Button>
                <Button size="large" href="#features" className="mono">View Features</Button>
              </div>
            </Col>

            <Col xs={24} md={11} id="demo">
              <div className="fade-up" style={{ animationDelay: '0.1s' }}>
                <Scanner />
              </div>
            </Col>
          </Row>
        </section>

        {/* STATS */}
        <section style={{ borderTop: `1px solid ${colors.lineStrong}`, borderBottom: `1px solid ${colors.lineStrong}`, background: colors.paperRaised }}>
          <div className="wrap">
            <Reveal as={Row}>
              {(inView) =>
                [
                  { title: 'Detection accuracy in testing', value: 92, suffix: '%', count: true },
                  { title: 'Average scan time', value: '<2', suffix: ' sec', count: false },
                  { title: 'Scam types covered', value: 4, count: true },
                ].map((s, i) => (
                  <Col xs={24} sm={8} key={s.title} className="stat-block" style={{ padding: '30px 28px', borderLeft: i > 0 ? `1px solid ${colors.line}` : 'none' }}>
                    {s.count ? (
                      <Counter
                        target={s.value}
                        active={inView}
                        suffix={s.suffix}
                        valueStyle={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '2.1rem', color: colors.ink }}
                      />
                    ) : (
                      <Statistic
                        value={s.value}
                        suffix={s.suffix}
                        valueStyle={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '2.1rem', color: colors.ink }}
                      />
                    )}
                    <Text style={{ color: colors.inkSoft, fontSize: '0.85rem' }}>{s.title}</Text>
                  </Col>
                ))
              }
            </Reveal>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="wrap" style={{ padding: '92px 28px' }}>
          <Reveal style={{ maxWidth: 620, marginBottom: 48 }}>
            <Text className="mono" style={{ color: colors.alert, fontSize: '0.78rem' }}>FILE 01</Text>
            <Title level={2} style={{ fontSize: '2rem', fontWeight: 800, marginTop: 8 }}>
              From message to risk score in four steps
            </Title>
            <Paragraph style={{ color: colors.inkSoft, marginTop: 12 }}>
              No sign-up needed to check something suspicious — paste it in and get an instant read.
            </Paragraph>
          </Reveal>

          <Reveal className="stagger-slide">
            <Steps direction="vertical" current={-1} items={steps.map((s) => ({ title: s.title, description: s.description }))} />
          </Reveal>
        </section>

        {/* FEATURES */}
        <section id="features" className="wrap" style={{ padding: '0 28px 92px' }}>
          <Reveal style={{ maxWidth: 620, marginBottom: 48 }}>
            <Text className="mono" style={{ color: colors.alert, fontSize: '0.78rem' }}>FILE 02</Text>
            <Title level={2} style={{ fontSize: '2rem', fontWeight: 800, marginTop: 8 }}>
              Built to be useful in the moment, not after
            </Title>
          </Reveal>

          <Reveal as={Row} className="stagger-rise" gutter={[1, 1]} style={{ background: colors.lineStrong, border: `1px solid ${colors.lineStrong}` }}>
            {features.map((f) => (
              <Col xs={24} sm={12} md={8} key={f.title}>
                <Card variant="borderless" className="feature-card-hover" style={{ background: colors.paperRaised, height: '100%' }}>
                  <div className="feature-mark mono">{f.mark}</div>
                  <Title level={4} style={{ fontSize: '1.02rem', marginBottom: 8 }}>{f.title}</Title>
                  <Paragraph style={{ fontSize: '0.88rem', color: colors.inkSoft, marginBottom: 0 }}>{f.text}</Paragraph>
                </Card>
              </Col>
            ))}
          </Reveal>
        </section>

        {/* TECH STACK */}
        <section id="stack" className="wrap" style={{ padding: '0 28px 92px' }}>
          <Reveal className="stack-panel">
            {(inView) => (
              <>
                <Title level={2} style={{ color: colors.paperRaised, fontSize: '1.8rem', marginBottom: 10 }}>
                  Tools behind ScamShield
                </Title>
                <Paragraph>A lean technology stack designed for fast detection and reliable results.</Paragraph>

                <div className={`stagger-pop${inView ? ' in-view' : ''}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {stack.map((t) => (
                    <Tag key={t} className="mono" style={{ background: 'transparent', borderColor: '#4d4838', color: '#e9e4d6', padding: '9px 16px', fontSize: '0.82rem' }}>
                      {t}
                    </Tag>
                  ))}
                </div>
              </>
            )}
          </Reveal>
        </section>

        {/* CTA */}
        <section className="wrap" style={{ padding: '0 28px 92px' }}>
          <Reveal className="reveal-scale">
            <Card variant="outlined" style={{ borderColor: colors.lineStrong }} styles={{ body: { padding: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' } }}>
              <div>
                <Title level={2} style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Think you got a scam message?</Title>
                <Paragraph style={{ color: colors.inkSoft, marginTop: 12, maxWidth: '46ch', marginBottom: 0 }}>
                  Paste it into ScamShield and get a risk score before you click anything.
                </Paragraph>
              </div>
              <Button type="primary" size="large" href="#demo" className="mono">Check a Message</Button>
            </Card>
          </Reveal>
        </section>
      </Layout.Content>

      <Layout.Footer className="site-footer" style={{ background: colors.ink }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span><strong>ScamShield</strong> — AI Scam Detector · 2026</span>
          <span>Case file closed when you are.</span>
        </div>
      </Layout.Footer>
    </Layout>
  );
}
