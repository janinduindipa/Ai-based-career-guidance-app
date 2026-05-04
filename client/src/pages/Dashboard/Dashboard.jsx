import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LangSwitcher, useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";

/* ─── Static data ─────────────────────────────────────────────────────────── */
const MARKET_DATA = [
  { label:"IT & Software",  pct:92, color:"#f59e0b" },
  { label:"Healthcare",     pct:78, color:"#22c55e" },
  { label:"Engineering",    pct:70, color:"#fb923c" },
  { label:"Finance",        pct:65, color:"#818cf8" },
  { label:"Education",      pct:55, color:"#38bdf8" },
  { label:"Legal",          pct:60, color:"#e879f9" },
];

const TIPS = [
  "Update your skills regularly — tech and business skills age fast in Sri Lanka's growing economy.",
  "60% of Sri Lankan IT companies hire based on portfolio projects. Start building yours today!",
  "Bilingual professionals (Sinhala + English) earn 25% more on average in the corporate sector.",
  "Networking matters — join industry groups and university alumni networks early in your career.",
];

// Minimal course lookup for Career Modal
const COURSES_MAP = {
  bsc_cse_moratuwa:     { title:"BSc Eng – CS & Engineering",          institution:"Univ. of Moratuwa",        url:"https://www.mrt.ac.lk" },
  bsc_ce_peradeniya:    { title:"BSc Eng – Computer Engineering",       institution:"Univ. of Peradeniya",      url:"https://www.pdn.ac.lk" },
  bsc_cs_colombo:       { title:"BSc Computer Science",                 institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  bsc_it_sliit:         { title:"BSc Information Technology",           institution:"SLIIT",                    url:"https://www.sliit.lk"  },
  bsc_cis_kelaniya:     { title:"BSc Computing & Info Systems",         institution:"Univ. of Kelaniya",        url:"https://www.kln.ac.lk" },
  hnd_se_nibm:          { title:"HND Software Engineering",             institution:"NIBM",                     url:"https://www.nibm.lk"   },
  hnd_data_science_nibm:{ title:"HND Data Science",                     institution:"NIBM",                     url:"https://www.nibm.lk"   },
  mbbs_colombo:         { title:"MBBS",                                  institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  mbbs_peradeniya:      { title:"MBBS",                                  institution:"Univ. of Peradeniya",      url:"https://www.pdn.ac.lk" },
  mbbs_kelaniya:        { title:"MBBS",                                  institution:"Univ. of Kelaniya",        url:"https://www.kln.ac.lk" },
  mbbs_ruhuna:          { title:"MBBS",                                  institution:"Univ. of Ruhuna",          url:"https://www.ruh.ac.lk" },
  bpharm_colombo:       { title:"BPharm",                                institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  bpharm_kelaniya:      { title:"BPharm",                                institution:"Univ. of Kelaniya",        url:"https://www.kln.ac.lk" },
  bsc_bme_moratuwa:     { title:"BSc Biomedical Engineering",            institution:"Univ. of Moratuwa",        url:"https://www.mrt.ac.lk" },
  bsc_nutrition_colombo:{ title:"BSc Nutrition & Food Science",          institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  bcom_colombo:         { title:"BCom",                                   institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  bba_kelaniya:         { title:"BBA",                                    institution:"Univ. of Kelaniya",        url:"https://www.kln.ac.lk" },
  bsc_accounting_sliit: { title:"BSc Accounting & Finance",              institution:"SLIIT",                    url:"https://www.sliit.lk"  },
  bsc_finance_sjp:      { title:"BSc Finance",                            institution:"Univ. of Sri Jayewardenepura", url:"https://www.sjp.ac.lk"},
  ca_icasl:             { title:"Chartered Accountancy (CA Sri Lanka)",  institution:"ICASL",                    url:"https://www.casrilanka.com"},
  hnd_business_nibm:    { title:"HND Business Management",               institution:"NIBM",                     url:"https://www.nibm.lk"   },
  llb_colombo:          { title:"LLB – Bachelor of Laws",                institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  sl_law_college:       { title:"Attorney-at-Law (AAL)",                  institution:"Sri Lanka Law College",    url:"https://www.lawcollege.lk"},
  ba_mass_comm_colombo: { title:"BA Mass Communication",                  institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  ba_mass_comm_kelaniya:{ title:"BA Mass Communication",                  institution:"Univ. of Kelaniya",        url:"https://www.kln.ac.lk" },
  bsc_psychology_kelaniya:{ title:"BSc Psychology",                       institution:"Univ. of Kelaniya",        url:"https://www.kln.ac.lk" },
  bsc_psychology_colombo: { title:"BSc Psychology",                       institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  bed_colombo:          { title:"BEd – Bachelor of Education",            institution:"Univ. of Colombo",         url:"https://www.cmb.ac.lk" },
  bed_peradeniya:       { title:"BEd – Bachelor of Education",            institution:"Univ. of Peradeniya",      url:"https://www.pdn.ac.lk" },
  bed_kelaniya:         { title:"BEd – Bachelor of Education",            institution:"Univ. of Kelaniya",        url:"https://www.kln.ac.lk" },
  bsc_civil_moratuwa:   { title:"BSc Civil Engineering",                  institution:"Univ. of Moratuwa",        url:"https://www.mrt.ac.lk" },
  bsc_civil_peradeniya: { title:"BSc Civil Engineering",                  institution:"Univ. of Peradeniya",      url:"https://www.pdn.ac.lk" },
  bsc_me_moratuwa:      { title:"BSc Mechanical Engineering",             institution:"Univ. of Moratuwa",        url:"https://www.mrt.ac.lk" },
  bsc_me_peradeniya:    { title:"BSc Mechanical Engineering",             institution:"Univ. of Peradeniya",      url:"https://www.pdn.ac.lk" },
  bsc_ee_moratuwa:      { title:"BSc Electrical Engineering",             institution:"Univ. of Moratuwa",        url:"https://www.mrt.ac.lk" },
  bsc_ee_peradeniya:    { title:"BSc Electrical Engineering",             institution:"Univ. of Peradeniya",      url:"https://www.pdn.ac.lk" },
};

const SKILL_COURSE_HINTS = {
  "Programming":        "Browse IT & Software courses",
  "Mathematics":        "Look into Engineering or Physical Science programmes",
  "Data Analysis":      "Check BSc CS or Data Science diplomas",
  "Communication":      "Consider Arts or Business programmes",
  "Leadership":         "Explore Business Administration or Education degrees",
  "Research":           "Consider postgraduate or Science programmes",
  "Problem Solving":    "Engineering and Technology degrees sharpen this skill",
  "Creativity":         "Arts, Design or Media courses can develop this",
  "Project Management": "Look at Business or Engineering Technology programmes",
  "Writing":            "Arts, Journalism or Mass Comm courses help",
  "Public Speaking":    "Law, Education or Business programmes build this",
  "Team Work":          "Almost any degree programme develops teamwork",
};

const TOUR_STEPS = [
  { title:"🎯 Career Matches", body:"Your top-matched careers appear here based on your stream, skills and grades. Click any card to explore details.", anchor:"career-section" },
  { title:"📋 Your Qualifications", body:"Your A/L and O/L results are displayed here so you and your advisor can review them at a glance.", anchor:"qual-section" },
  { title:"🔍 SWOT Analysis", body:"See your personal strengths, weaknesses, opportunities and threats based on your career goals.", anchor:"swot-section" },
  { title:"✏️ Edit Profile", body:"Click 'Edit Profile' anytime to update your details — your career matches will recalculate instantly.", anchor:"nav-edit" },
];

/*/* ─── Helpers — career modal helpers ─────────────────────────────────────────────────────────────── */
function gradeColor(g) {
  return { A:"#22c55e", B:"#60a5fa", C:"#f59e0b", S:"#fb923c", W:"#ef4444" }[g] || "#94a3b8";
}

function computeCompleteness(profile) {
  if (!profile) return 0;
  let pct = 0;
  if (profile.displayName?.trim()) pct += 15;
  if (profile.alStream)           pct += 20;
  const alFilled = Object.values(profile.alResults || {}).filter(Boolean).length;
  pct += Math.min(alFilled / 3, 1) * 20;
  const olFilled = Object.keys(profile.olResults || {}).length;
  pct += Math.min(olFilled / 3, 1) * 15;
  pct += Math.min((profile.skills    || []).length / 3, 1) * 15;
  pct += Math.min((profile.interests || []).length / 3, 1) * 15;
  return Math.round(pct);
}

function computeSWOT(profile, recommendations) {
  if (!profile || recommendations.length === 0) return null;

  const topCareer      = recommendations[0];
  const skills         = profile.skills    || [];
  const interests      = profile.interests || [];
  const alResults      = profile.alResults || {};
  const olResults      = profile.olResults || {};
  const stream         = profile.alStream  || "";
  const requiredSkills = topCareer.requiredSkills || [];

  const goodAL       = Object.entries(alResults).filter(([,g]) => ["A","B"].includes(g));
  const weakAL       = Object.entries(alResults).filter(([,g]) => ["C","S","W"].includes(g));
  const mathGrade    = olResults["Mathematics"] || olResults["Maths"] || "";
  const matchedSkills = requiredSkills.filter(s => skills.includes(s));
  const missingSkills = requiredSkills.filter(s => !skills.includes(s));

  const strengths = [], weaknesses = [], opportunities = [], threats = [];

  // Strengths
  if (matchedSkills.length > 0)
    strengths.push(`Matches ${matchedSkills.length}/${requiredSkills.length} key skills for ${topCareer.title}: ${matchedSkills.slice(0,3).join(", ")}`);
  else if (skills.length > 0)
    strengths.push(`Proficient in ${skills.slice(0,3).join(", ")}${skills.length > 3 ? ` +${skills.length-3} more` : ""}`);
  if (goodAL.length > 0)
    strengths.push(`Strong A/L grades in ${goodAL.map(([s]) => s).join(", ")}`);
  if (topCareer.matchScore >= 70)
    strengths.push(`${topCareer.matchScore}% match — excellent alignment with ${topCareer.title}`);
  else if (topCareer.matchScore >= 50)
    strengths.push(`Good fit for ${topCareer.title} at ${topCareer.matchScore}% match`);
  if (interests.length >= 3)
    strengths.push(`Broad interest profile spanning ${interests.slice(0,3).join(", ")}`);
  if (stream)
    strengths.push(`${stream} background provides a solid academic foundation`);

  // Weaknesses
  if (missingSkills.length > 0)
    weaknesses.push({ text:`Missing key skills for ${topCareer.title}: ${missingSkills.slice(0,3).join(", ")}`, skills: missingSkills.slice(0,3) });
  else if (skills.length < 3)
    weaknesses.push({ text:"Limited skill profile — consider adding technical and soft skills", skills:[] });
  if (weakAL.length > 0)
    weaknesses.push({ text:`Lower grades in ${weakAL.map(([s]) => s).join(", ")} — may affect competitive entry`, skills:[] });
  if (topCareer.matchScore < 50)
    weaknesses.push({ text:`Career match of ${topCareer.matchScore}% suggests profile gaps to address`, skills:[] });
  if (interests.length < 2)
    weaknesses.push({ text:"Narrow interest range — broadening may reveal more paths", skills:[] });
  if (mathGrade && ["C","S","W"].includes(mathGrade))
    weaknesses.push({ text:"O/L Mathematics result may limit entry to quantitative programmes", skills:[] });
  if (skills.length > 0 && !skills.includes("Communication"))
    weaknesses.push({ text:"Communication not listed — critical for career advancement", skills:["Communication"] });

  // Opportunities
  const highDemand = recommendations.filter(r => r.demand === "High Demand");
  if (highDemand.length > 0)
    opportunities.push(`${highDemand.length} high-demand career${highDemand.length > 1 ? "s" : ""} matched: ${highDemand.slice(0,2).map(c => c.title).join(", ")}`);
  if (recommendations.length >= 4)
    opportunities.push(`${recommendations.length} career paths available — flexibility to pivot as market evolves`);
  opportunities.push("Sri Lanka's digital economy is expanding — local and remote roles growing fast");
  if (skills.includes("Programming") || skills.includes("Data Analysis"))
    opportunities.push("Tech skills are globally transferable — opens international remote work opportunities");

  // Threats
  if (topCareer.demand === "High Demand")
    threats.push(`${topCareer.title} attracts competition — portfolio and certifications are essential`);
  threats.push("Rapidly evolving industries require continuous upskilling to stay relevant");
  if (recommendations.length < 3)
    threats.push("Narrow career match profile — diversifying skills could open more options");
  if (!stream)
    threats.push("Missing A/L stream data reduces recommendation accuracy");

  return { topCareer, strengths, weaknesses, opportunities, threats };
}

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes barFill{from{width:0}to{width:var(--w)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
.fade-up{animation:fadeUp .5s ease both}
.shimmer-text{
  background:linear-gradient(90deg,#f59e0b 0%,#fde68a 40%,#f59e0b 60%,#d97706 100%);
  background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;animation:shimmer 3s linear infinite
}
.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(245,158,11,.025) 1px,transparent 1px),
  linear-gradient(90deg,rgba(245,158,11,.025) 1px,transparent 1px);background-size:50px 50px}
.stat-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:22px 24px;flex:1;min-width:0;transition:all .3s}
.stat-card:hover{background:rgba(245,158,11,.05);border-color:rgba(245,158,11,.2);transform:translateY(-2px)}
.career-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:22px;cursor:pointer;transition:all .3s;display:flex;flex-direction:column}
.career-card:hover{background:rgba(245,158,11,.05);border-color:rgba(245,158,11,.3);transform:translateY(-3px);box-shadow:0 8px 32px rgba(245,158,11,.1)}
.panel{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:20px 22px}
.match-bar{height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
.match-fill{height:100%;background:linear-gradient(90deg,#f59e0b,#fde68a);border-radius:3px;animation:barFill .9s ease forwards}
.tag-chip{display:inline-flex;align-items:center;padding:5px 13px;border-radius:100px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.18);color:#fde68a;font-size:12px;font-weight:600;margin:3px}
.action-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:13px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all .25s}
.action-card:hover{background:rgba(245,158,11,.06);border-color:rgba(245,158,11,.25);transform:translateX(3px)}
.logout-btn{background:rgba(239,68,68,.08);color:rgba(239,68,68,.8);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s}
.logout-btn:hover{background:rgba(239,68,68,.15)}
.qual-grade{display:inline-flex;align-items:center;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:700;margin:3px;border:1px solid}
.swot-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.swot-card{border-radius:14px;padding:18px 20px}
.swot-item{display:flex;align-items:flex-start;gap:8px;margin-bottom:7px;font-size:13px;line-height:1.55;color:rgba(226,232,240,.75)}
.swot-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:6px}
/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(2,8,23,.88);backdrop-filter:blur(12px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-box{background:#0c1628;border:1px solid rgba(255,255,255,.1);border-radius:24px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;animation:modalIn .3s ease both}
.score-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.score-bar-bg{flex:1;height:6px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
.skill-check{display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:600;margin:3px}
.course-link{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);margin-bottom:6px;cursor:pointer;transition:all .2s;text-decoration:none}
.course-link:hover{background:rgba(245,158,11,.06);border-color:rgba(245,158,11,.2)}
/* Completeness bar */
.complete-bar{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;margin-top:6px}
.complete-fill{height:100%;border-radius:3px;transition:width 1.2s ease}
/* Tour */
.tour-overlay{position:fixed;inset:0;background:rgba(2,8,23,.92);z-index:600;display:flex;align-items:center;justify-content:center}
.tour-card{background:#0c1628;border:1px solid rgba(245,158,11,.25);border-radius:20px;padding:32px 36px;max-width:440px;width:90%;animation:modalIn .3s ease both;text-align:center}
/* Print styles */
@media print{
  .no-print{display:none!important}
  .modal-overlay,.tour-overlay{display:none!important}
  body{background:#fff!important;color:#000!important}
  .print-only{display:block!important}
  .panel,.stat-card,.career-card,.swot-card{border:1px solid #ddd!important;background:#fff!important;color:#000!important;-webkit-print-color-adjust:exact}
}
.print-only{display:none}
@media(max-width:900px){
  .info-row{grid-template-columns:1fr!important}
  .bottom-row{grid-template-columns:1fr!important}
  .swot-grid{grid-template-columns:1fr!important}
}
@media(max-width:650px){
  .stats-row{flex-direction:column!important}
  .career-grid{grid-template-columns:1fr!important}
  .actions-grid{grid-template-columns:1fr!important}
}
`;

/*/* ─── Component — SWOT + profile completeness added ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const [profile,        setProfile]       = useState(null);
  const [recommendations,setRec]           = useState([]);
  const [loading,        setLoading]       = useState(true);
  const [selectedCareer, setSelectedCareer]= useState(null); // career modal
  const [showTour,       setShowTour]      = useState(false);
  const [tourStep,       setTourStep]      = useState(0);

  useEffect(() => {
    api.get("/users/profile").then(res => {
      const d = res.data;
      setProfile(d);
      if (!d.profileComplete) { navigate("/profile-setup"); return; }
      setRec(d.recommendations || []);
      // Show onboarding tour first time only
      if (!localStorage.getItem("careerai_toured")) setShowTour(true);
    }).catch(() => navigate("/profile-setup"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const dismissTour = () => { localStorage.setItem("careerai_toured","1"); setShowTour(false); };
  const nextTour    = () => { if (tourStep < TOUR_STEPS.length - 1) setTourStep(t => t+1); else dismissTour(); };

  const handleLogout  = async () => { await logout(); navigate("/login"); };
  const displayName   = profile?.displayName || user?.displayName || "Student";
  const firstName     = displayName.split(" ")[0];
  const highDemand    = recommendations.filter(r => r.demand === "High Demand").length;
  const tip           = TIPS[new Date().getDay() % TIPS.length];
  const skillCount    = profile?.skills?.length    || 0;
  const interestCount = profile?.interests?.length || 0;
  const completeness  = computeCompleteness(profile);
  const swot          = computeSWOT(profile, recommendations);
  const userSkills    = profile?.skills || [];

  const hasQualifications = profile && (
    profile.alStream ||
    Object.keys(profile.alResults || {}).length > 0 ||
    Object.keys(profile.olResults || {}).length > 0
  );

  // completeness colour
  const completeColor = completeness >= 80 ? "#22c55e" : completeness >= 50 ? "#f59e0b" : "#ef4444";
  const completeLabel = completeness >= 80 ? "Great profile!" : completeness >= 50 ? "Almost there" : "Needs attention";

  if (loading) return (
    <div style={{fontFamily:"Outfit,sans-serif",background:"#020817",color:"#e2e8f0",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{textAlign:"center"}}>
        <div style={{width:44,height:44,border:"3px solid rgba(245,158,11,.2)",borderTopColor:"#f59e0b",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 14px"}}/>
        <p style={{fontSize:13,color:"rgba(226,232,240,.45)"}}>Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"Outfit,sans-serif",background:"#020817",color:"#e2e8f0",minHeight:"100vh",width:"100vw",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{CSS}</style>
      <div className="grid-bg"/>

      {/* ── NAV ── */}
      <nav className="no-print" style={{position:"sticky",top:0,zIndex:100,background:"rgba(2,8,23,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"12px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:"#f59e0b",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:"#020817"}}>C</div>
          <span style={{fontWeight:700,fontSize:15,letterSpacing:"-0.02em"}}>CareerAI<span style={{color:"#f59e0b"}}>.</span>lk</span>
          {profile?.alStream && (
            <span style={{fontSize:11,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.2)",color:"#f59e0b",padding:"3px 10px",borderRadius:100,fontWeight:700,marginLeft:4}}>
              {profile.alStream}
              {profile.alSubjects?.length > 0 && ` · ${profile.alSubjects.slice(0,3).join(", ")}${profile.alSubjects.length > 3 ? "…" : ""}`}
            </span>
          )}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <LangSwitcher/>
          <button onClick={()=>navigate("/courses")} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#e2e8f0",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>🎓 {t('courses')}</button>
          {/* CV Re-upload */}
          <button onClick={()=>navigate("/profile-setup")} style={{background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.25)",color:"#a5b4fc",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>📄 Re-upload CV</button>
          <button id="nav-edit" onClick={()=>navigate("/profile-setup")} style={{background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.25)",color:"#f59e0b",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>✏️ Edit Profile</button>
          {/* Print / Export */}
          <button onClick={()=>window.print()} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(226,232,240,.5)",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>🖨️</button>
          <button className="logout-btn" onClick={handleLogout}>{t('signOut')}</button>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={{padding:"32px 40px 60px",position:"relative",zIndex:1}}>

        {/* Print header (hidden on screen) */}
        <div className="print-only" style={{marginBottom:24,paddingBottom:16,borderBottom:"2px solid #f59e0b"}}>
          <h1 style={{fontSize:24,fontWeight:900}}>CareerAI.lk — Career Report</h1>
          <p style={{fontSize:13,color:"#666"}}>Generated for: {displayName}</p>
        </div>

        {/* Welcome */}
        <div className="fade-up" style={{marginBottom:24}}>
          <p style={{fontSize:13,color:"rgba(226,232,240,.4)",marginBottom:4}}>{t('welcomeBack')} 👋</p>
          <h1 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1}}>
            {t('helloStudent')}, <span className="shimmer-text">{firstName}</span>
          </h1>
          {profile?.alStream && (
            <p style={{fontSize:14,color:"rgba(226,232,240,.45)",marginTop:8}}>
              {t('yourInsights')} — <strong style={{color:"rgba(226,232,240,.7)"}}>{profile.alStream}</strong>
            </p>
          )}
        </div>

        {/* ── STAT CARDS ── */}
        <div className="fade-up stats-row" style={{display:"flex",gap:14,marginBottom:20,animationDelay:".05s"}}>
          {[
            {label:t('careerMatches'), value:recommendations.length, color:"#f59e0b", icon:"🎯", sub:t('matchedProfile')},
            {label:t('highDemand'),    value:highDemand,             color:"#22c55e", icon:"📈", sub:t('inDemand')},
            {label:t('mySkills'),      value:skillCount,             color:"#f59e0b", icon:"⚡", sub:t('strengthsAdded')},
            {label:t('yourInterests'), value:interestCount,          color:"#a5b4fc", icon:"🌟", sub:t('yourInterests')},
          ].map((s,i)=>(
            <div key={i} className="stat-card fade-up" style={{animationDelay:`${i*.06}s`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <p style={{fontSize:11,color:"rgba(226,232,240,.35)",textTransform:"uppercase",letterSpacing:".1em"}}>{s.label}</p>
                <span style={{fontSize:18}}>{s.icon}</span>
              </div>
              <p style={{fontSize:42,fontWeight:900,color:s.color,letterSpacing:"-0.04em",lineHeight:1}}>{s.value}</p>
              <p style={{fontSize:11,color:"rgba(226,232,240,.3)",marginTop:8}}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── PROFILE COMPLETENESS ── */}
        <div className="fade-up panel no-print" style={{marginBottom:24,animationDelay:".07s"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <p style={{fontSize:12,fontWeight:700,color:"rgba(226,232,240,.5)",textTransform:"uppercase",letterSpacing:".1em"}}>📊 Profile Completeness</p>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:completeColor,fontWeight:700}}>{completeLabel}</span>
              <span style={{fontSize:22,fontWeight:900,color:completeColor}}>{completeness}%</span>
            </div>
          </div>
          <div className="complete-bar">
            <div className="complete-fill" style={{width:`${completeness}%`,background:`linear-gradient(90deg,${completeColor}88,${completeColor})`}}/>
          </div>
          {completeness < 100 && (
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
              {!profile?.displayName      && <span style={{fontSize:11,color:"rgba(226,232,240,.35)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:100}}>+ Add your name</span>}
              {!profile?.alStream         && <span style={{fontSize:11,color:"rgba(226,232,240,.35)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:100}}>+ Select A/L stream</span>}
              {Object.keys(profile?.alResults||{}).length < 3 && <span style={{fontSize:11,color:"rgba(226,232,240,.35)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:100}}>+ Add A/L grades</span>}
              {Object.keys(profile?.olResults||{}).length < 3 && <span style={{fontSize:11,color:"rgba(226,232,240,.35)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:100}}>+ Add O/L results</span>}
              {(profile?.skills||[]).length < 3   && <span style={{fontSize:11,color:"rgba(226,232,240,.35)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:100}}>+ Add skills</span>}
              {(profile?.interests||[]).length < 3 && <span style={{fontSize:11,color:"rgba(226,232,240,.35)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:100}}>+ Add interests</span>}
            </div>
          )}
        </div>

        {/* ── CAREER RECOMMENDATIONS ── */}
        <div id="career-section" className="fade-up" style={{marginBottom:24,animationDelay:".1s"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <h2 style={{fontSize:17,fontWeight:800,letterSpacing:"-0.02em"}}>🎯 {t('topMatches')}</h2>
            <span onClick={()=>navigate("/courses")} style={{fontSize:12,color:"#f59e0b",cursor:"pointer",fontWeight:600}}>{t('viewCourses')}</span>
          </div>

          {recommendations.length === 0 ? (
            <div style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:"52px 24px",textAlign:"center"}}>
              <p style={{fontSize:40,marginBottom:14}}>🎯</p>
              <p style={{fontSize:18,fontWeight:700,marginBottom:8}}>{t('noRec')}</p>
              <p style={{fontSize:13,color:"rgba(226,232,240,.4)",marginBottom:24,maxWidth:360,margin:"0 auto 24px"}}>Complete your profile to get personalised career matches.</p>
              <button onClick={()=>navigate("/profile-setup")} style={{background:"#f59e0b",color:"#020817",border:"none",borderRadius:10,padding:"11px 24px",fontWeight:800,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>Complete Profile →</button>
            </div>
          ) : (
            <div className="career-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {recommendations.map((c,i)=>(
                <div key={c.id||i} className="career-card fade-up" style={{animationDelay:`${i*.05}s`}} onClick={()=>setSelectedCareer(c)}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14}}>
                    <div style={{width:42,height:42,borderRadius:10,background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.icon}</div>
                    <div style={{minWidth:0}}>
                      <h3 style={{fontSize:14,fontWeight:700,marginBottom:3}}>{c.title}</h3>
                      <p style={{fontSize:11,color:"rgba(226,232,240,.4)",lineHeight:1.5}}>{c.description}</p>
                    </div>
                  </div>
                  <span style={{display:"inline-block",background:`${c.demandColor}18`,border:`1px solid ${c.demandColor}40`,color:c.demandColor,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,letterSpacing:".06em",textTransform:"uppercase",marginBottom:14}}>{c.demand}</span>
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:11,color:"rgba(226,232,240,.4)",textTransform:"uppercase",letterSpacing:".06em"}}>{t('matchScore')}</span>
                      <span style={{fontSize:12,fontWeight:700,color:"#f59e0b"}}>{c.matchScore}%</span>
                    </div>
                    <div className="match-bar"><div className="match-fill" style={{width:`${c.matchScore}%`}}/></div>
                  </div>
                  <div style={{marginTop:"auto",borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <p style={{fontSize:10,color:"rgba(226,232,240,.3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:2}}>Salary Range</p>
                      <p style={{fontSize:13,fontWeight:600,color:"#f59e0b"}}>{c.salary}</p>
                    </div>
                    <span style={{fontSize:11,color:"rgba(245,158,11,.7)",fontWeight:600}}>View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── QUALIFICATIONS ── */}
        {hasQualifications && (
          <div id="qual-section" className="fade-up panel" style={{marginBottom:24,animationDelay:".13s"}}>
            <p style={{fontSize:11,fontWeight:700,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:".1em",marginBottom:18}}>📋 Your Qualifications</p>

            {profile.alStream && (
              <div style={{marginBottom:16}}>
                <p style={{fontSize:11,color:"rgba(226,232,240,.35)",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>{t('alStream')}</p>
                <span style={{display:"inline-block",padding:"6px 18px",borderRadius:100,fontWeight:700,fontSize:13,background:"rgba(165,180,252,.1)",border:"1px solid rgba(165,180,252,.25)",color:"#a5b4fc"}}>{profile.alStream}</span>
                {profile.alSubjects?.length > 0 && (
                  <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
                    {profile.alSubjects.map(sub=>(
                      <span key={sub} style={{fontSize:11,padding:"3px 10px",borderRadius:100,background:"rgba(165,180,252,.08)",border:"1px solid rgba(165,180,252,.2)",color:"rgba(165,180,252,.7)",fontWeight:600}}>{sub}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {Object.keys(profile.alResults || {}).length > 0 && (
              <div style={{marginBottom:16}}>
                <p style={{fontSize:11,color:"rgba(226,232,240,.35)",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>A/L Subject Results</p>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                  {Object.entries(profile.alResults).map(([subject,grade])=>{
                    const c = gradeColor(grade);
                    return <span key={subject} className="qual-grade" style={{background:`${c}15`,borderColor:`${c}40`,color:c}}>{subject} <strong style={{marginLeft:6,fontSize:13}}>{grade}</strong></span>;
                  })}
                </div>
              </div>
            )}

            {Object.keys(profile.olResults || {}).length > 0 && (
              <div>
                <p style={{fontSize:11,color:"rgba(226,232,240,.35)",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>O/L Results</p>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                  {Object.entries(profile.olResults).map(([subject,grade])=>{
                    const c = gradeColor(grade);
                    return <span key={subject} className="qual-grade" style={{background:`${c}10`,borderColor:`${c}30`,color:`${c}cc`,fontSize:11}}>{subject} <strong style={{marginLeft:5}}>{grade}</strong></span>;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SWOT ANALYSIS ── */}
        {swot && (
          <div id="swot-section" className="fade-up" style={{marginBottom:24,animationDelay:".16s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <h2 style={{fontSize:17,fontWeight:800,letterSpacing:"-0.02em"}}>🔍 Your Career SWOT Analysis</h2>
              <span style={{fontSize:11,color:"rgba(226,232,240,.3)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",padding:"4px 12px",borderRadius:100}}>
                Based on: {swot.topCareer.title}
              </span>
            </div>

            <div className="swot-grid">
              {/* Strengths */}
              <div className="swot-card" style={{background:"rgba(34,197,94,.05)",border:"1px solid rgba(34,197,94,.15)"}}>
                <p style={{fontSize:12,fontWeight:800,color:"#86efac",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>💪 Strengths</p>
                {swot.strengths.length > 0 ? swot.strengths.map((s,i)=>(
                  <div key={i} className="swot-item"><div className="swot-dot" style={{background:"#22c55e"}}/><span>{s}</span></div>
                )) : <p style={{fontSize:12,color:"rgba(226,232,240,.3)"}}>Complete your profile to see strengths</p>}
              </div>

              {/* Weaknesses with action hints */}
              <div className="swot-card" style={{background:"rgba(239,68,68,.05)",border:"1px solid rgba(239,68,68,.15)"}}>
                <p style={{fontSize:12,fontWeight:800,color:"#fca5a5",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>⚠️ Weaknesses</p>
                {swot.weaknesses.length > 0 ? swot.weaknesses.map((w,i)=>(
                  <div key={i} style={{marginBottom:10}}>
                    <div className="swot-item" style={{marginBottom:4}}><div className="swot-dot" style={{background:"#ef4444"}}/><span>{w.text}</span></div>
                    {w.skills?.length > 0 && w.skills.map(skill => SKILL_COURSE_HINTS[skill] && (
                      <div key={skill} onClick={()=>navigate("/courses")} style={{display:"flex",alignItems:"center",gap:6,marginLeft:14,marginBottom:3,cursor:"pointer",fontSize:11,color:"#60a5fa",fontWeight:600}}>
                        <span>→</span><span style={{textDecoration:"underline"}}>{SKILL_COURSE_HINTS[skill]}</span>
                      </div>
                    ))}
                  </div>
                )) : <p style={{fontSize:12,color:"rgba(226,232,240,.3)"}}>No major weaknesses detected</p>}
              </div>

              {/* Opportunities */}
              <div className="swot-card" style={{background:"rgba(96,165,250,.05)",border:"1px solid rgba(96,165,250,.15)"}}>
                <p style={{fontSize:12,fontWeight:800,color:"#93c5fd",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>🌱 Opportunities</p>
                {swot.opportunities.map((s,i)=>(
                  <div key={i} className="swot-item"><div className="swot-dot" style={{background:"#60a5fa"}}/><span>{s}</span></div>
                ))}
              </div>

              {/* Threats */}
              <div className="swot-card" style={{background:"rgba(251,146,60,.05)",border:"1px solid rgba(251,146,60,.15)"}}>
                <p style={{fontSize:12,fontWeight:800,color:"#fdba74",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>🚨 Threats</p>
                {swot.threats.map((s,i)=>(
                  <div key={i} className="swot-item"><div className="swot-dot" style={{background:"#fb923c"}}/><span>{s}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS + INTERESTS + MARKET ── */}
        <div className="fade-up info-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:24,animationDelay:".2s"}}>
          <div className="panel">
            <p style={{fontSize:11,fontWeight:700,color:"#f59e0b",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>⚡ {t('yourSkills')}</p>
            {skillCount > 0 ? (
              <div style={{display:"flex",flexWrap:"wrap"}}>
                {profile.skills.map(s=><span key={s} className="tag-chip">{s}</span>)}
              </div>
            ) : (
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <p style={{fontSize:13,color:"rgba(226,232,240,.3)",marginBottom:10}}>No skills added yet</p>
                <button onClick={()=>navigate("/profile-setup")} style={{fontSize:12,color:"#f59e0b",background:"none",border:"1px solid rgba(245,158,11,.3)",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>Add Skills →</button>
              </div>
            )}
          </div>

          <div className="panel">
            <p style={{fontSize:11,fontWeight:700,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>🎯 {t('yourInterests')}</p>
            {interestCount > 0 ? (
              <div style={{display:"flex",flexWrap:"wrap"}}>
                {profile.interests.map(i=><span key={i} className="tag-chip" style={{background:"rgba(99,102,241,.08)",borderColor:"rgba(99,102,241,.2)",color:"#c4b5fd"}}>{i}</span>)}
              </div>
            ) : (
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <p style={{fontSize:13,color:"rgba(226,232,240,.3)",marginBottom:10}}>No interests added yet</p>
                <button onClick={()=>navigate("/profile-setup")} style={{fontSize:12,color:"#a5b4fc",background:"none",border:"1px solid rgba(99,102,241,.3)",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>Add Interests →</button>
              </div>
            )}
          </div>

          <div className="panel">
            <p style={{fontSize:11,fontWeight:700,color:"rgba(226,232,240,.4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>📊 Market Demand</p>
            {MARKET_DATA.map(({label,pct,color})=>(
              <div key={label} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:"rgba(226,232,240,.6)"}}>{label}</span>
                  <span style={{fontSize:11,fontWeight:700,color}}>{pct}%</span>
                </div>
                <div className="match-bar">
                  <div className="match-fill" style={{width:`${pct}%`,background:`linear-gradient(90deg,${color}88,${color})`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK ACTIONS + TIP ── */}
        <div className="fade-up bottom-row no-print" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,animationDelay:".25s"}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,color:"rgba(226,232,240,.35)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Quick Actions</p>
            <div className="actions-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {label:"Browse Courses",  sub:"Find university programmes",                                  icon:"🎓", path:"/courses"},
                {label:"Update Profile",  sub:"Edit skills & interests",                                     icon:"✏️", path:"/profile-setup"},
                {label:"Your Skills",     sub:profile?.skills?.slice(0,2).join(", ")||"Add strengths",       icon:"⚡", path:"/profile-setup"},
                {label:"Your Interests",  sub:profile?.interests?.slice(0,2).join(", ")||"Add interests",    icon:"🎯", path:"/profile-setup"},
              ].map(item=>(
                <div key={item.label} className="action-card" onClick={()=>navigate(item.path)}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:9,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{item.icon}</div>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:700,marginBottom:2}}>{item.label}</p>
                      <p style={{fontSize:11,color:"rgba(226,232,240,.35)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.sub}</p>
                    </div>
                  </div>
                  <span style={{color:"#f59e0b",fontSize:14,flexShrink:0}}>→</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{background:"rgba(245,158,11,.04)",border:"1px solid rgba(245,158,11,.1)"}}>
            <p style={{fontSize:11,fontWeight:700,color:"#f59e0b",letterSpacing:".08em",textTransform:"uppercase",marginBottom:12}}>💡 Career Tip</p>
            <p style={{fontSize:14,color:"rgba(226,232,240,.7)",lineHeight:1.8}}>{tip}</p>
            <div style={{marginTop:18,paddingTop:14,borderTop:"1px solid rgba(245,158,11,.1)"}}>
              <button onClick={()=>navigate("/courses")} style={{width:"100%",background:"rgba(245,158,11,.12)",border:"1px solid rgba(245,158,11,.25)",color:"#f59e0b",borderRadius:8,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>
                Browse 40+ Courses & Programmes →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CAREER DETAIL MODAL ══ */}
      {selectedCareer && (
        <div className="modal-overlay no-print" onClick={()=>setSelectedCareer(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{padding:"28px 28px 20px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:52,height:52,borderRadius:14,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{selectedCareer.icon}</div>
                  <div>
                    <h2 style={{fontSize:20,fontWeight:900,letterSpacing:"-0.02em",marginBottom:6}}>{selectedCareer.title}</h2>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      <span style={{background:`${selectedCareer.demandColor}18`,border:`1px solid ${selectedCareer.demandColor}40`,color:selectedCareer.demandColor,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,textTransform:"uppercase",letterSpacing:".06em"}}>{selectedCareer.demand}</span>
                      <span style={{background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.2)",color:"#f59e0b",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:100}}>{selectedCareer.salary}</span>
                    </div>
                  </div>
                </div>
                <button onClick={()=>setSelectedCareer(null)} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(226,232,240,.5)",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,fontFamily:"Outfit,sans-serif",fontSize:16}}>✕</button>
              </div>
              <p style={{fontSize:13,color:"rgba(226,232,240,.5)",lineHeight:1.7,marginTop:14}}>{selectedCareer.description}</p>
            </div>

            <div style={{padding:"20px 28px"}}>

              {/* Match Score + Breakdown */}
              <div style={{marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <p style={{fontSize:12,fontWeight:700,color:"rgba(226,232,240,.4)",textTransform:"uppercase",letterSpacing:".1em"}}>🎯 Match Score</p>
                  <span style={{fontSize:28,fontWeight:900,color:"#f59e0b"}}>{selectedCareer.matchScore}%</span>
                </div>
                {selectedCareer.scoreBreakdown && (
                  <div style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,padding:"14px 16px"}}>
                    {[
                      {label:"A/L Stream Match", val: selectedCareer.scoreBreakdown.stream,    max:50, color:"#a5b4fc"},
                      {label:"Skills Overlap",   val: selectedCareer.scoreBreakdown.skills,    max:60, color:"#f59e0b"},
                      {label:"Interest Overlap", val: selectedCareer.scoreBreakdown.interests, max:40, color:"#34d399"},
                      {label:"A/L Grades",       val: selectedCareer.scoreBreakdown.grades,    max:15, color:"#60a5fa"},
                      {label:"O/L Math Bonus",   val: selectedCareer.scoreBreakdown.mathBonus, max:8,  color:"#fb923c"},
                    ].filter(r => r.max > 0).map(({label,val,max,color})=>(
                      <div key={label} className="score-row">
                        <span style={{width:140,fontSize:11,color:"rgba(226,232,240,.45)",flexShrink:0}}>{label}</span>
                        <div className="score-bar-bg">
                          <div style={{height:"100%",width:`${(val/max)*100}%`,background:color,borderRadius:3,transition:"width .8s ease"}}/>
                        </div>
                        <span style={{width:52,fontSize:11,fontWeight:700,color,textAlign:"right",flexShrink:0}}>+{val} pts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Required Skills Checklist */}
              {selectedCareer.requiredSkills?.length > 0 && (
                <div style={{marginBottom:22}}>
                  <p style={{fontSize:12,fontWeight:700,color:"rgba(226,232,240,.4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>⚡ Required Skills</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {selectedCareer.requiredSkills.map(skill=>{
                      const has = userSkills.includes(skill);
                      return (
                        <div key={skill} className="skill-check" style={{background: has ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.08)", border:`1px solid ${has ? "rgba(34,197,94,.25)" : "rgba(239,68,68,.2)"}`, color: has ? "#86efac" : "#fca5a5"}}>
                          <span>{has ? "✅" : "❌"}</span>
                          <span>{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                  {selectedCareer.requiredSkills.filter(s=>!userSkills.includes(s)).length > 0 && (
                    <div style={{marginTop:10,padding:"10px 14px",background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.15)",borderRadius:10,fontSize:12,color:"rgba(226,232,240,.5)"}}>
                      💡 Missing skills can be built through relevant degree programmes and online courses.
                      <span onClick={()=>{setSelectedCareer(null);navigate("/courses");}} style={{color:"#818cf8",fontWeight:700,cursor:"pointer",marginLeft:6}}>Browse Courses →</span>
                    </div>
                  )}
                </div>
              )}

              {/* Related Courses */}
              {selectedCareer.relatedCourseIds?.length > 0 && (
                <div style={{marginBottom:20}}>
                  <p style={{fontSize:12,fontWeight:700,color:"rgba(226,232,240,.4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>📚 Related Courses ({selectedCareer.relatedCourseIds.length})</p>
                  <div>
                    {selectedCareer.relatedCourseIds.slice(0,4).map(id=>{
                      const course = COURSES_MAP[id];
                      if (!course) return null;
                      return (
                        <a key={id} href={course.url} target="_blank" rel="noopener noreferrer" className="course-link">
                          <div>
                            <p style={{fontSize:13,fontWeight:600,color:"#e2e8f0",marginBottom:2}}>{course.title}</p>
                            <p style={{fontSize:11,color:"rgba(226,232,240,.4)"}}>{course.institution}</p>
                          </div>
                          <span style={{color:"#f59e0b",fontSize:13,flexShrink:0}}>↗</span>
                        </a>
                      );
                    })}
                  </div>
                  <button onClick={()=>{setSelectedCareer(null);navigate("/courses");}} style={{width:"100%",marginTop:8,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.25)",color:"#f59e0b",borderRadius:10,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>
                    Browse All Related Courses →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ ONBOARDING TOUR ══ */}
      {showTour && (
        <div className="tour-overlay">
          <div className="tour-card">
            <div style={{fontSize:40,marginBottom:16}}>{["🎯","📋","🔍","✏️"][tourStep]}</div>
            <h3 style={{fontSize:20,fontWeight:900,marginBottom:10,letterSpacing:"-0.02em"}}>{TOUR_STEPS[tourStep].title}</h3>
            <p style={{fontSize:14,color:"rgba(226,232,240,.6)",lineHeight:1.8,marginBottom:24}}>{TOUR_STEPS[tourStep].body}</p>

            {/* Step dots */}
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:24}}>
              {TOUR_STEPS.map((_,i)=>(
                <div key={i} style={{width: i===tourStep ? 20 : 6, height:6, borderRadius:3, background: i===tourStep ? "#f59e0b" : "rgba(255,255,255,.15)", transition:"all .3s"}}/>
              ))}
            </div>

            <div style={{display:"flex",gap:10}}>
              <button onClick={dismissTour} style={{flex:1,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(226,232,240,.5)",borderRadius:10,padding:"11px",fontSize:13,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>Skip Tour</button>
              <button onClick={nextTour} style={{flex:2,background:"#f59e0b",color:"#020817",border:"none",borderRadius:10,padding:"11px",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>
                {tourStep < TOUR_STEPS.length - 1 ? "Next →" : "Let's go! 🚀"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
