import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LangSwitcher } from '../../context/LanguageContext';

const FEATURES = [
  { icon: '🎯', title: 'AI-Powered Matching',    desc: "Our engine analyzes your A/L results, skills, and interests to surface careers you'd never have discovered alone." },
  { icon: '📊', title: 'Live Job Market Data',   desc: 'Recommendations backed by real-time Sri Lankan job market trends from ICTA and Census datasets.' },
  { icon: '🌐', title: 'Three Languages',        desc: 'Fully accessible in Sinhala, Tamil, and English — built for every Sri Lankan student.' },
  { icon: '🎓', title: 'University Pathways',    desc: 'Discover the exact degree programs, vocational courses, and institutes that match your suggested career.' },
];

const STATS = [
  { value: '50,000+', label: 'Students Guided' },
  { value: '200+',    label: 'Career Paths' },
  { value: '3',       label: 'Languages' },
  { value: '95%',     label: 'Accuracy Rate' },
];

const TESTIMONIALS = [
  { name: 'Kasun P.',  stream: 'Physical Science', text: 'CareerAI suggested Software Engineering — I never would have thought of it myself. Now I\'m at Moratuwa!', emoji: '👨‍💻' },
  { name: 'Nimasha F.', stream: 'Biological Science', text: 'The CV scanner filled my whole profile in 10 seconds. Amazing experience.', emoji: '👩‍⚕️' },
  { name: 'Arun T.',   stream: 'Commerce',          text: 'Sinhala support made it so easy for my parents to understand my career options too.', emoji: '🧑‍💼' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const [scrollY,   setScrollY]   = useState(0);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#020817', color: '#e2e8f0', width: '100vw', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020817; }
        ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 2px; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float     { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(245,158,11,.3)} 50%{box-shadow:0 0 60px rgba(245,158,11,.7)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin      { to{transform:rotate(360deg)} }

        .fade-up   { animation: fadeUp .8s ease forwards; }
        .delay-1   { animation-delay:.1s; opacity:0; }
        .delay-2   { animation-delay:.3s; opacity:0; }
        .delay-3   { animation-delay:.5s; opacity:0; }
        .delay-4   { animation-delay:.7s; opacity:0; }
        .float     { animation: float 6s ease-in-out infinite; }

        .btn-primary {
          background: linear-gradient(135deg,#f59e0b,#d97706); color:#020817;
          font-weight:700; padding:16px 40px; border-radius:6px; border:none;
          cursor:pointer; font-size:15px; letter-spacing:.05em; text-transform:uppercase;
          transition:all .3s; animation: pulseGlow 3s ease-in-out infinite; font-family:Outfit,sans-serif;
        }
        .btn-primary:hover { transform:translateY(-3px) scale(1.03); }
        .btn-secondary {
          background:transparent; color:#e2e8f0; font-weight:600; padding:15px 40px;
          border-radius:6px; border:1px solid rgba(226,232,240,.25); cursor:pointer;
          font-size:15px; letter-spacing:.05em; text-transform:uppercase; transition:all .3s; font-family:Outfit,sans-serif;
        }
        .btn-secondary:hover { border-color:#f59e0b; color:#f59e0b; transform:translateY(-3px); }

        .feature-card {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:10px; padding:36px 32px; transition:all .4s; position:relative; overflow:hidden;
        }
        .feature-card::before {
          content:''; position:absolute; top:0; left:0; width:100%; height:2px;
          background:linear-gradient(90deg,transparent,#f59e0b,transparent);
          transform:translateX(-100%); transition:transform .6s;
        }
        .feature-card:hover::before { transform:translateX(100%); }
        .feature-card:hover { background:rgba(245,158,11,.06); border-color:rgba(245,158,11,.25); transform:translateY(-6px); }

        .testimonial-card {
          background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07);
          border-radius:12px; padding:28px; transition:all .3s;
        }
        .testimonial-card:hover { border-color:rgba(245,158,11,.2); background:rgba(245,158,11,.03); }

        .nav-link { color:rgba(226,232,240,.7); text-decoration:none; font-size:13px;
          font-weight:500; letter-spacing:.08em; text-transform:uppercase; transition:color .2s; }
        .nav-link:hover { color:#f59e0b; }

        .shimmer-text {
          background:linear-gradient(90deg,#f59e0b 0%,#fde68a 40%,#f59e0b 60%,#d97706 100%);
          background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:shimmer 3s linear infinite;
        }
        .grid-bg {
          position:absolute; inset:0;
          background-image:linear-gradient(rgba(245,158,11,.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(245,158,11,.04) 1px,transparent 1px);
          background-size:40px 40px;
        }
        .stat-card { text-align:center; padding:32px 20px; border-right:1px solid rgba(255,255,255,.07); }
        .stat-card:last-child { border-right:none; }

        /* Mobile nav */
        .nav-links-desktop { display:flex; gap:40px; align-items:center; }
        .nav-btns-desktop  { display:flex; gap:12px; }
        .hamburger         { display:none; }
        .mobile-menu       { display:none; }

        @media (max-width: 768px) {
          .nav-links-desktop { display:none !important; }
          .nav-btns-desktop  { display:none !important; }
          .hamburger         { display:flex !important; }
          .mobile-menu.open  { display:flex !important; }
          .hero-btns         { flex-direction:column !important; align-items:center !important; }
          .stats-grid        { grid-template-columns:repeat(2,1fr) !important; }
          .features-grid     { grid-template-columns:1fr !important; }
          .howit-grid        { grid-template-columns:1fr !important; gap:36px !important; }
          .testimonials-grid { grid-template-columns:1fr !important; }
          .footer-inner      { flex-direction:column !important; gap:12px !important; text-align:center; }
          .nav-pad           { padding:20px 20px !important; }
          .hero-pad          { padding:120px 24px 80px !important; }
          .section-pad       { padding:80px 24px !important; }
          .cta-pad           { padding:100px 24px !important; }
          .footer-pad        { padding:32px 24px !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        background: scrollY > 40 ? 'rgba(2,8,23,0.95)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(245,158,11,0.1)' : 'none',
        transition:'all .4s',
      }}>
        <div className="nav-pad" style={{ padding:'20px 60px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:36, height:36, background:'#f59e0b', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#020817' }}>C</div>
            <span style={{ fontWeight:700, fontSize:17, letterSpacing:'-0.02em' }}>CareerAI<span style={{ color:'#f59e0b' }}>.</span>lk</span>
          </div>

          {/* Desktop links */}
          <div className="nav-links-desktop">
            {['Features', 'How It Works', 'About'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g,'-')}`} className="nav-link">{link}</a>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="nav-btns-desktop" style={{ alignItems:'center', gap:12 }}>
            <LangSwitcher />
            <button className="btn-secondary" style={{ padding:'10px 22px', fontSize:13 }} onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn-primary"   style={{ padding:'10px 22px', fontSize:13, animation:'none' }} onClick={() => navigate('/register')}>Get Started</button>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}
            style={{ background:'none', border:'1px solid rgba(255,255,255,.15)', borderRadius:6, padding:'8px 10px', cursor:'pointer', color:'#e2e8f0', fontSize:18, display:'none', flexDirection:'column', gap:5, lineHeight:1 }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}
          style={{ flexDirection:'column', padding:'16px 24px 24px', background:'rgba(2,8,23,0.98)', borderTop:'1px solid rgba(255,255,255,.06)', gap:12, display:'none' }}>
          {['Features', 'How It Works', 'About'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g,'-')}`} className="nav-link" onClick={() => setMenuOpen(false)} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.05)', display:'block' }}>{link}</a>
          ))}
          <LangSwitcher style={{ marginTop:8 }} />
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button className="btn-secondary" style={{ flex:1, padding:'12px', fontSize:13 }} onClick={() => { navigate('/login'); setMenuOpen(false); }}>Sign In</button>
            <button className="btn-primary"   style={{ flex:1, padding:'12px', fontSize:13, animation:'none' }} onClick={() => { navigate('/register'); setMenuOpen(false); }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="hero-pad" style={{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:'120px 60px 80px' }}>
        <div className="grid-bg" />
        {/* Glow orbs */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,.12) 0%,transparent 70%)', top:'10%', left:'50%', transform:'translateX(-50%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)', bottom:'20%', right:'10%', pointerEvents:'none' }} />

        {/* Floating elements */}
        <div className="float" style={{ position:'absolute', top:'20%', right:'8%', width:80, height:80, borderRadius:12, background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>🎓</div>
        <div className="float" style={{ position:'absolute', bottom:'25%', left:'6%', width:64, height:64, borderRadius:'50%', background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, animationDelay:'2s' }}>📈</div>
        <div className="float" style={{ position:'absolute', top:'60%', right:'12%', width:52, height:52, borderRadius:10, background:'rgba(34,197,94,.06)', border:'1px solid rgba(34,197,94,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, animationDelay:'3.5s' }}>🤖</div>

        <div style={{ maxWidth:860, textAlign:'center', position:'relative', zIndex:1 }}>
          {/* Badge */}
          <div className="fade-up delay-1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.25)', borderRadius:100, padding:'6px 18px', marginBottom:32, fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#f59e0b' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#f59e0b', display:'inline-block' }} />
            {t('tagline')}
          </div>

          <h1 className="fade-up delay-2" style={{ fontSize:'clamp(40px,7vw,88px)', fontWeight:900, lineHeight:1.0, letterSpacing:'-0.04em', marginBottom:28 }}>
            Find Your<br />
            <span className="shimmer-text" style={{ fontFamily:"'Playfair Display', serif", fontStyle:'italic' }}>
              Perfect Career
            </span><br />
            Path Today
          </h1>

          <p className="fade-up delay-3" style={{ fontSize:'clamp(15px,2.5vw,18px)', lineHeight:1.7, color:'rgba(226,232,240,.6)', maxWidth:560, margin:'0 auto 48px', fontWeight:300 }}>
            {t('landingSubtitle')}
          </p>

          <div className="fade-up delay-4 hero-btns" style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/register')}>{t('getStarted')}</button>
            <button className="btn-secondary" onClick={() => { const el=document.getElementById('how-it-works'); if(el) el.scrollIntoView({behavior:'smooth'}); }}>{t('learnMore')}</button>
          </div>

          {/* Social proof */}
          <div className="fade-up delay-4" style={{ marginTop:56, display:'flex', alignItems:'center', justifyContent:'center', gap:20, flexWrap:'wrap' }}>
            <div style={{ display:'flex' }}>
              {['🧑‍🎓','👩‍💼','👨‍💻','👩‍🔬','🧑‍🏫'].map((e,i) => (
                <div key={i} style={{ width:34, height:34, borderRadius:'50%', background:`hsl(${i*40+20},70%,35%)`, border:'2px solid #020817', marginLeft:i>0?-10:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{e}</div>
              ))}
            </div>
            <p style={{ fontSize:13, color:'rgba(226,232,240,.5)' }}><strong style={{ color:'#f59e0b' }}>50,000+</strong> {t('trusted')}</p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {STATS.map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:40, fontWeight:900, letterSpacing:'-0.04em', color:'#f59e0b' }}>{s.value}</div>
              <div style={{ fontSize:13, color:'rgba(226,232,240,.5)', marginTop:6, fontWeight:500, textTransform:'uppercase', letterSpacing:'.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="section-pad" style={{ padding:'80px 60px' }}>
        <div style={{ textAlign:'center', marginBottom:70 }}>
          <p style={{ color:'#f59e0b', fontSize:12, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>What We Offer</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1 }}>
            Everything you need to choose<br />
            <span className="shimmer-text">your future confidently</span>
          </h2>
        </div>
        <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:24 }}>
          {FEATURES.map((f,i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize:40, marginBottom:20 }}>{f.icon}</div>
              <h3 style={{ fontSize:19, fontWeight:700, marginBottom:12, letterSpacing:'-0.02em' }}>{f.title}</h3>
              <p style={{ fontSize:14, lineHeight:1.8, color:'rgba(226,232,240,.55)', fontWeight:300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="section-pad" style={{ padding:'120px 60px', position:'relative', background:'rgba(245,158,11,.02)', borderTop:'1px solid rgba(245,158,11,.06)', borderBottom:'1px solid rgba(245,158,11,.06)' }}>
        <div style={{ textAlign:'center' }}>
          <p style={{ color:'#f59e0b', fontSize:12, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>The Process</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:70 }}>
            {t('howItWorks')}
          </h2>
          <div className="howit-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:48, position:'relative' }}>
            {[
              { step:'01', icon:'📤', title: t('step1'), desc:'Upload a PDF/DOCX CV and our Gemini AI extracts your full academic profile in seconds.' },
              { step:'02', icon:'🤖', title: t('step2'), desc:'Our model cross-references your profile with thousands of career and education data points.' },
              { step:'03', icon:'🎯', title: t('step3'), desc:'Receive a ranked list of careers, university courses, and actionable next steps — in your language.' },
            ].map((item,i) => (
              <div key={i} style={{ textAlign:'left', position:'relative' }}>
                <div style={{ fontSize:72, fontWeight:900, color:'rgba(245,158,11,.08)', lineHeight:1, marginBottom:10, letterSpacing:'-0.04em' }}>{item.step}</div>
                <div style={{ fontSize:32, marginBottom:12 }}>{item.icon}</div>
                <h3 style={{ fontSize:19, fontWeight:700, marginBottom:10, letterSpacing:'-0.02em' }}>{item.title}</h3>
                <p style={{ fontSize:14, lineHeight:1.8, color:'rgba(226,232,240,.5)', fontWeight:300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="about" className="section-pad" style={{ padding:'80px 60px' }}>
        <div style={{ textAlign:'center', marginBottom:70 }}>
          <p style={{ color:'#f59e0b', fontSize:12, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>Student Stories</p>
          <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1 }}>
            {t('trusted')}
          </h2>
        </div>
        <div className="testimonials-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24 }}>
          {TESTIMONIALS.map((tm,i) => (
            <div key={i} className="testimonial-card">
              <div style={{ fontSize:36, marginBottom:16 }}>{tm.emoji}</div>
              <p style={{ fontSize:14, color:'rgba(226,232,240,.7)', lineHeight:1.8, fontWeight:300, marginBottom:20, fontStyle:'italic' }}>"{tm.text}"</p>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'#e2e8f0' }}>{tm.name}</p>
                <p style={{ fontSize:11, color:'#f59e0b', fontWeight:600, marginTop:2 }}>{tm.stream}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-pad" style={{ padding:'140px 60px', textAlign:'center', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(245,158,11,.08) 0%,transparent 70%)', pointerEvents:'none' }} />
        <p style={{ color:'#f59e0b', fontSize:12, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', marginBottom:24 }}>Start Today</p>
        <h2 style={{ fontSize:'clamp(30px,5vw,64px)', fontWeight:900, letterSpacing:'-0.04em', marginBottom:24, lineHeight:1.05 }}>
          Your career doesn't have<br />to be a guessing game.
        </h2>
        <p style={{ fontSize:'clamp(14px,2vw,17px)', color:'rgba(226,232,240,.5)', marginBottom:48, fontWeight:300 }}>
          Join thousands of Sri Lankan students who found their path with CareerAI.
        </p>
        <button className="btn-primary" style={{ fontSize:16, padding:'18px 56px' }} onClick={() => navigate('/register')}>
          {t('getStarted')} — Free
        </button>

        {/* Language note */}
        <div style={{ marginTop:40, display:'inline-flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <p style={{ fontSize:13, color:'rgba(226,232,240,.35)' }}>Available in three languages</p>
          <LangSwitcher />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.06)' }}>
        <div className="footer-inner footer-pad" style={{ padding:'40px 60px', display:'flex', justifyContent:'space-between', alignItems:'center', color:'rgba(226,232,240,.35)', fontSize:13 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, background:'#f59e0b', borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:'#020817' }}>C</div>
            <span>CareerAI.lk</span>
          </div>
          <span>© 2025 — PUSL3190 Computing Project</span>
          <span>Built for Sri Lankan school leavers 🇱🇰</span>
        </div>
      </footer>
    </div>
  );
}
