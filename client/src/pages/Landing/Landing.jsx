import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🎯',
    title: 'AI-Powered Matching',
    desc: 'Our engine analyzes your A/L results, skills, and interests to surface careers you\'d never have discovered alone.',
  },
  {
    icon: '📊',
    title: 'Live Job Market Data',
    desc: 'Recommendations backed by real-time Sri Lankan job market trends from ICTA and Census datasets.',
  },
  {
    icon: '🌐',
    title: 'Three Languages',
    desc: 'Fully accessible in Sinhala, Tamil, and English — built for every Sri Lankan student.',
  },
  {
    icon: '🎓',
    title: 'University Pathways',
    desc: 'Discover the exact degree programs, vocational courses, and institutes that match your suggested career.',
  },
];

const STATS = [
  { value: '50,000+', label: 'Students Guided' },
  { value: '200+', label: 'Career Paths' },
  { value: '3', label: 'Languages' },
  { value: '95%', label: 'Accuracy Rate' },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#020817', color: '#e2e8f0', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020817; }
        ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 2px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.3); }
          50% { box-shadow: 0 0 60px rgba(245,158,11,0.7); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes gridSlide {
          from { transform: translateX(0); }
          to { transform: translateX(40px); }
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.3s; opacity: 0; }
        .delay-3 { animation-delay: 0.5s; opacity: 0; }
        .delay-4 { animation-delay: 0.7s; opacity: 0; }
        .float { animation: float 6s ease-in-out infinite; }
        .btn-primary {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #020817;
          font-weight: 700;
          padding: 16px 40px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .btn-primary:hover { transform: translateY(-3px) scale(1.03); }
        .btn-secondary {
          background: transparent;
          color: #e2e8f0;
          font-weight: 600;
          padding: 15px 40px;
          border-radius: 4px;
          border: 1px solid rgba(226,232,240,0.25);
          cursor: pointer;
          font-size: 15px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover { border-color: #f59e0b; color: #f59e0b; transform: translateY(-3px); }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 36px 32px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, #f59e0b, transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .feature-card:hover::before { transform: translateX(100%); }
        .feature-card:hover {
          background: rgba(245,158,11,0.06);
          border-color: rgba(245,158,11,0.25);
          transform: translateY(-6px);
        }
        .nav-link {
          color: rgba(226,232,240,0.7);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #f59e0b; }
        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b 0%, #fde68a 40%, #f59e0b 60%, #d97706 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .stat-card {
          text-align: center;
          padding: 32px 20px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .stat-card:last-child { border-right: none; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrollY > 40 ? 'rgba(2,8,23,0.95)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(245,158,11,0.1)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, background: '#f59e0b', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 18, color: '#020817',
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>CareerAI<span style={{ color: '#f59e0b' }}>.</span>lk</span>
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {['Features', 'How It Works', 'About'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ','-')}`} className="nav-link">{link}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ padding: '10px 24px', fontSize: 13 }}
            onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn-primary" style={{ padding: '10px 24px', fontSize: 13 }}
            onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 60px 80px',
      }}>
        <div className="grid-bg" />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          bottom: '20%', right: '10%', pointerEvents: 'none',
        }} />

        {/* Floating orbit elements */}
        <div className="float" style={{
          position: 'absolute', top: '20%', right: '8%',
          width: 80, height: 80, borderRadius: '12px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
        }}>🎓</div>
        <div className="float" style={{
          position: 'absolute', bottom: '25%', left: '6%',
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          animationDelay: '2s',
        }}>📈</div>

        <div style={{ maxWidth: 860, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="fade-up delay-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: '100px', padding: '6px 18px', marginBottom: 32,
            fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#f59e0b',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            AI-Powered Career Guidance for Sri Lanka
          </div>

          <h1 className="fade-up delay-2" style={{
            fontSize: 'clamp(44px, 7vw, 88px)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            marginBottom: 28,
          }}>
            Find Your<br />
            <span className="shimmer-text" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
              Perfect Career
            </span><br />
            Path Today
          </h1>

          <p className="fade-up delay-3" style={{
            fontSize: 18, lineHeight: 1.7, color: 'rgba(226,232,240,0.6)',
            maxWidth: 560, margin: '0 auto 48px', fontWeight: 300,
          }}>
            Enter your A/L results, skills, and interests. Our AI engine matches you
            to the careers and courses that fit your unique profile — in Sinhala, Tamil, or English.
          </p>

          <div className="fade-up delay-4" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Start Free — Get Matched
            </button>
            <button className="btn-secondary" onClick={() => navigate('/demo')}>
              Watch Demo →
            </button>
          </div>

          {/* Social proof */}
          <div className="fade-up delay-4" style={{ marginTop: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ display: 'flex' }}>
              {['🧑‍🎓','👩‍💼','👨‍💻','👩‍🔬','🧑‍🏫'].map((e, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: `hsl(${i * 40 + 20}, 70%, 35%)`,
                  border: '2px solid #020817', marginLeft: i > 0 ? -10 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{e}</div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.5)' }}>
              <strong style={{ color: '#f59e0b' }}>50,000+</strong> students already guided
            </p>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', color: '#f59e0b' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(226,232,240,0.5)', marginTop: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>What We Offer</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Everything you need to choose<br />
            <span className="shimmer-text">your future confidently</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 40, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(226,232,240,0.55)', fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{
        padding: '120px 60px', position: 'relative',
        background: 'rgba(245,158,11,0.02)',
        borderTop: '1px solid rgba(245,158,11,0.06)',
        borderBottom: '1px solid rgba(245,158,11,0.06)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>The Process</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 80 }}>
            Three steps to clarity
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, position: 'relative' }}>
            {[
              { step: '01', title: 'Build Your Profile', desc: 'Enter your A/L stream, subject results, certificates, and personal interests.' },
              { step: '02', title: 'AI Analyses You', desc: 'Our model cross-references your profile with thousands of career and education data points.' },
              { step: '03', title: 'Get Your Roadmap', desc: 'Receive a ranked list of careers, university courses, and actionable next steps.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'left', position: 'relative' }}>
                <div style={{
                  fontSize: 72, fontWeight: 900, color: 'rgba(245,158,11,0.08)',
                  lineHeight: 1, marginBottom: 16, letterSpacing: '-0.04em',
                }}>{item.step}</div>
                <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(226,232,240,0.5)', fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '140px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>Start Today</p>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 24, lineHeight: 1.05 }}>
          Your career doesn't have<br />to be a guessing game.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(226,232,240,0.5)', marginBottom: 48, fontWeight: 300 }}>
          Join thousands of Sri Lankan students who found their path with CareerAI.
        </p>
        <button className="btn-primary" style={{ fontSize: 16, padding: '18px 56px' }}
          onClick={() => navigate('/register')}>
          Get Your Free Career Match
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'rgba(226,232,240,0.35)', fontSize: 13,
      }}>
        <span>© 2025 CareerAI.lk — PUSL3190 Computing Project</span>
        <span>Built for Sri Lankan school leavers 🇱🇰</span>
      </footer>
    </div>
  );
}