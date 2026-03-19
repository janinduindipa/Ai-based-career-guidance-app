import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "" || password === "") {
        setError("Please fill in all fields.");
      } else {
        navigate("/dashboard");
      }
    }, 1200);
  };

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", background: "#020817", color: "#e2e8f0", minHeight: "100vh", display: "flex", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-16px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .d1 { animation-delay: 0.1s; opacity: 0; }
        .d2 { animation-delay: 0.25s; opacity: 0; }
        .d3 { animation-delay: 0.4s; opacity: 0; }
        .d4 { animation-delay: 0.55s; opacity: 0; }
        .d5 { animation-delay: 0.7s; opacity: 0; }
        .floatA { animation: float 5s ease-in-out infinite; }
        .floatB { animation: float 7s ease-in-out infinite; animation-delay: 1.5s; }
        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b 0%, #fde68a 40%, #f59e0b 60%, #d97706 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 3s linear infinite;
        }
        .input-field {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
          padding: 14px 18px; color: #e2e8f0; font-size: 15px;
          font-family: Outfit, sans-serif; outline: none; transition: all 0.3s ease;
        }
        .input-field:focus { border-color: #f59e0b; background: rgba(245,158,11,0.05); box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
        .input-field::placeholder { color: rgba(226,232,240,0.3); }
        .btn-primary {
          width: 100%; background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #020817; font-weight: 700; padding: 15px; border-radius: 6px;
          border: none; cursor: pointer; font-size: 15px; letter-spacing: 0.06em;
          text-transform: uppercase; font-family: Outfit, sans-serif;
          transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245,158,11,0.35); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .google-btn {
          width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px; padding: 13px; color: #e2e8f0; font-size: 14px;
          font-weight: 500; font-family: Outfit, sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s ease;
        }
        .google-btn:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); transform: translateY(-2px); }
        .grid-bg {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(2,8,23,0.3); border-top-color: #020817; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px", overflow: "hidden" }}>
        <div className="grid-bg" />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)", top: "20%", left: "30%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />



   

        <div className="floatA" style={{ position: "absolute", bottom: "32%", left: "5%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, zIndex: 1 }}>
          📈
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 72, position: "relative", zIndex: 2 }}>
          <div style={{ width: 38, height: 38, background: "#f59e0b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#020817" }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>CareerAI<span style={{ color: "#f59e0b" }}>.</span>lk</span>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="fade-up d1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "100px", padding: "5px 16px", marginBottom: 28, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f59e0b" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            AI-Powered Career Guidance
          </div>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(38px, 4vw, 62px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 20 }}>
            Welcome<br />
            <span className="shimmer-text" style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic" }}>Back</span>
          </h1>
          <p className="fade-up d3" style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(226,232,240,0.5)", fontWeight: 300, maxWidth: 380 }}>
            Sign in to access your personalized career recommendations and continue your journey.
          </p>
          <div className="fade-up d4" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 36 }}>
            {["🎯 AI Matched", "📊 Live Data", "🌐 3 Languages"].map(tag => (
              <span key={tag} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", padding: "6px 16px", fontSize: 12, fontWeight: 500, color: "rgba(226,232,240,0.6)" }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div style={{ width: 1, background: "rgba(255,255,255,0.06)", margin: "40px 0" }} />

      {/* RIGHT PANEL */}
      <div style={{ width: 480, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px" }}>
        <div className="fade-up d1" style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Sign in to your account</h2>
          <p style={{ fontSize: 14, color: "rgba(226,232,240,0.45)", fontWeight: 300 }}>
            Do not have an account?
            <span onClick={() => navigate("/register")} style={{ color: "#f59e0b", cursor: "pointer", fontWeight: 600, marginLeft: 4 }}>Create one free</span>
          </p>
        </div>

        <div className="fade-up d2">
          <button className="google-btn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="fade-up d3" style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 12, color: "rgba(226,232,240,0.3)", fontWeight: 500, letterSpacing: "0.08em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#fca5a5", display: "flex", alignItems: "center", gap: 8 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="fade-up d3">
            <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 8 }}>Email Address</label>
            <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="fade-up d4">
            <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 8 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} className="input-field" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(226,232,240,0.4)", fontSize: 16, padding: 0 }}>
                {showPassword ? "hide" : "show"}
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: 8 }}>
              <span style={{ fontSize: 12, color: "#f59e0b", cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
            </div>
          </div>

          <div className="fade-up d5" style={{ marginTop: 4 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <><div className="spinner" />&nbsp;Signing in...</> : "Sign In"}
            </button>
          </div>
        </form>

        <p className="fade-up d5" style={{ marginTop: 32, fontSize: 12, color: "rgba(226,232,240,0.25)", textAlign: "center", lineHeight: 1.7 }}>
          By signing in you agree to our
          <span style={{ color: "rgba(245,158,11,0.6)", cursor: "pointer", margin: "0 4px" }}>Terms of Service</span>
          and
          <span style={{ color: "rgba(245,158,11,0.6)", cursor: "pointer", margin: "0 4px" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}