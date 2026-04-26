import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, LangSwitcher } from "../../context/LanguageContext";
import api from "../../services/api";

const ALL_COURSES = [
  // ── IT / Software Engineering ──
  { id: "bsc_cse_moratuwa",    title: "BSc (Hons) Engineering – Computer Science & Engineering", institution: "University of Moratuwa",          location: "Moratuwa",    duration: "4 Years",   type: "Degrees",     streams: ["Physical Science","Technology"],                       url: "https://www.mrt.ac.lk" },
  { id: "bsc_ce_peradeniya",   title: "BSc (Hons) Engineering – Computer Engineering",           institution: "University of Peradeniya",         location: "Peradeniya",  duration: "4 Years",   type: "Degrees",     streams: ["Physical Science","Technology"],                       url: "https://www.pdn.ac.lk" },
  { id: "bsc_cs_colombo",      title: "BSc (Hons) Computer Science",                             institution: "University of Colombo",            location: "Colombo",     duration: "4 Years",   type: "Degrees",     streams: ["Physical Science","Technology"],                       url: "https://www.cmb.ac.lk" },
  { id: "bsc_it_sliit",        title: "BSc (Hons) Information Technology",                       institution: "SLIIT",                            location: "Malabe",      duration: "4 Years",   type: "Degrees",     streams: ["Physical Science","Technology","Commerce"],            url: "https://www.sliit.lk" },
  { id: "bsc_cis_kelaniya",    title: "BSc (Hons) Computing & Information Systems",              institution: "University of Kelaniya",           location: "Kelaniya",    duration: "4 Years",   type: "Degrees",     streams: ["Physical Science","Technology"],                       url: "https://www.kln.ac.lk" },
  { id: "bsc_it_ruhuna",       title: "BSc (Hons) Information Technology",                       institution: "University of Ruhuna",             location: "Matara",      duration: "4 Years",   type: "Degrees",     streams: ["Physical Science","Technology"],                       url: "https://www.ruh.ac.lk" },
  { id: "bsc_cs_nsbm",         title: "BSc (Hons) Computer Science",                             institution: "NSBM Green University",            location: "Homagama",    duration: "3 Years",   type: "Degrees",     streams: ["Physical Science","Technology"],                       url: "https://www.nsbm.ac.lk" },
  { id: "hnd_se_nibm",         title: "Higher National Diploma in Software Engineering",         institution: "NIBM",                             location: "Colombo",     duration: "2 Years",   type: "Diplomas",    streams: ["Physical Science","Technology"],                       url: "https://www.nibm.lk" },
  { id: "hnd_data_science_nibm",title:"Higher National Diploma in Data Science",                 institution: "NIBM",                             location: "Colombo",     duration: "2 Years",   type: "Diplomas",    streams: ["Physical Science","Commerce"],                         url: "https://www.nibm.lk" },
  { id: "nvq_it_tvec",         title: "NVQ Level 5 in Information Technology",                   institution: "TVEC Sri Lanka",                   location: "Nationwide",  duration: "1 Year",    type: "NVQ",         streams: ["Physical Science","Technology","Commerce","Arts"],      url: "https://www.tvec.gov.lk" },
  { id: "cert_web_icta",       title: "Certificate in Web Development",                          institution: "ICTA Sri Lanka",                   location: "Colombo",     duration: "6 Months",  type: "Certificate", streams: ["Physical Science","Technology","Commerce","Arts"],      url: "https://www.icta.lk" },

  // ── Medicine / Biological Science ──
  { id: "mbbs_colombo",        title: "MBBS – Bachelor of Medicine, Bachelor of Surgery",        institution: "University of Colombo",            location: "Colombo",     duration: "5 Years",   type: "Degrees",     streams: ["Biological Science"],                                  url: "https://www.cmb.ac.lk" },
  { id: "mbbs_peradeniya",     title: "MBBS – Bachelor of Medicine, Bachelor of Surgery",        institution: "University of Peradeniya",         location: "Peradeniya",  duration: "5 Years",   type: "Degrees",     streams: ["Biological Science"],                                  url: "https://www.pdn.ac.lk" },
  { id: "mbbs_kelaniya",       title: "MBBS – Bachelor of Medicine, Bachelor of Surgery",        institution: "University of Kelaniya",           location: "Kelaniya",    duration: "5 Years",   type: "Degrees",     streams: ["Biological Science"],                                  url: "https://www.kln.ac.lk" },
  { id: "mbbs_ruhuna",         title: "MBBS – Bachelor of Medicine, Bachelor of Surgery",        institution: "University of Ruhuna",             location: "Matara",      duration: "5 Years",   type: "Degrees",     streams: ["Biological Science"],                                  url: "https://www.ruh.ac.lk" },
  { id: "bpharm_colombo",      title: "BPharm – Bachelor of Pharmacy",                           institution: "University of Colombo",            location: "Colombo",     duration: "4 Years",   type: "Degrees",     streams: ["Biological Science"],                                  url: "https://www.cmb.ac.lk" },
  { id: "bpharm_kelaniya",     title: "BPharm – Bachelor of Pharmacy",                           institution: "University of Kelaniya",           location: "Kelaniya",    duration: "4 Years",   type: "Degrees",     streams: ["Biological Science"],                                  url: "https://www.kln.ac.lk" },
  { id: "bsc_bme_moratuwa",    title: "BSc (Hons) Biomedical Engineering",                       institution: "University of Moratuwa",           location: "Moratuwa",    duration: "4 Years",   type: "Degrees",     streams: ["Biological Science","Physical Science"],               url: "https://www.mrt.ac.lk" },
  { id: "bsc_nutrition_colombo",title:"BSc in Nutrition & Food Science",                         institution: "University of Colombo",            location: "Colombo",     duration: "4 Years",   type: "Degrees",     streams: ["Biological Science"],                                  url: "https://www.cmb.ac.lk" },

  // ── Commerce & Business ──
  { id: "bcom_colombo",        title: "BCom – Bachelor of Commerce",                             institution: "University of Colombo",            location: "Colombo",     duration: "3 Years",   type: "Degrees",     streams: ["Commerce"],                                            url: "https://www.cmb.ac.lk" },
  { id: "bba_kelaniya",        title: "BBA – Bachelor of Business Administration",               institution: "University of Kelaniya",           location: "Kelaniya",    duration: "3 Years",   type: "Degrees",     streams: ["Commerce"],                                            url: "https://www.kln.ac.lk" },
  { id: "bsc_accounting_sliit",title: "BSc (Hons) Accounting & Finance",                         institution: "SLIIT Business School",            location: "Colombo",     duration: "3 Years",   type: "Degrees",     streams: ["Commerce"],                                            url: "https://www.sliit.lk" },
  { id: "bsc_finance_sjp",     title: "BSc Finance (Special)",                                   institution: "Univ. of Sri Jayewardenepura",     location: "Nugegoda",    duration: "3 Years",   type: "Degrees",     streams: ["Commerce"],                                            url: "https://www.sjp.ac.lk" },
  { id: "ca_icasl",            title: "Chartered Accountancy (CA Sri Lanka)",                    institution: "ICASL",                            location: "Colombo",     duration: "3–5 Years", type: "Certificate", streams: ["Commerce"],                                            url: "https://www.casrilanka.com" },
  { id: "hnd_business_nibm",   title: "Higher National Diploma in Business Management",          institution: "NIBM",                             location: "Colombo",     duration: "2 Years",   type: "Diplomas",    streams: ["Commerce","Arts"],                                     url: "https://www.nibm.lk" },
  { id: "cim_srilanka",        title: "CIM Professional Diploma in Marketing",                   institution: "CIM Sri Lanka",                    location: "Colombo",     duration: "1 Year",    type: "Diplomas",    streams: ["Commerce","Arts"],                                     url: "https://www.cimsrilanka.com" },

  // ── Arts & Law ──
  { id: "llb_colombo",         title: "LLB – Bachelor of Laws",                                  institution: "University of Colombo",            location: "Colombo",     duration: "4 Years",   type: "Degrees",     streams: ["Arts"],                                                url: "https://www.cmb.ac.lk" },
  { id: "sl_law_college",      title: "Attorney-at-Law (AAL)",                                   institution: "Sri Lanka Law College",            location: "Colombo",     duration: "3 Years",   type: "Certificate", streams: ["Arts"],                                                url: "https://www.lawcollege.lk" },
  { id: "ba_mass_comm_colombo",title: "BA in Mass Communication",                                institution: "University of Colombo",            location: "Colombo",     duration: "3 Years",   type: "Degrees",     streams: ["Arts"],                                                url: "https://www.cmb.ac.lk" },
  { id: "ba_mass_comm_kelaniya",title:"BA in Mass Communication",                                institution: "University of Kelaniya",           location: "Kelaniya",    duration: "3 Years",   type: "Degrees",     streams: ["Arts"],                                                url: "https://www.kln.ac.lk" },
  { id: "bsc_psychology_kelaniya",title:"BSc Psychology (Special)",                              institution: "University of Kelaniya",           location: "Kelaniya",    duration: "3 Years",   type: "Degrees",     streams: ["Arts"],                                                url: "https://www.kln.ac.lk" },
  { id: "bsc_psychology_colombo",title:"BSc Psychology",                                         institution: "University of Colombo",            location: "Colombo",     duration: "3 Years",   type: "Degrees",     streams: ["Arts"],                                                url: "https://www.cmb.ac.lk" },
  { id: "bed_colombo",         title: "BEd – Bachelor of Education",                             institution: "University of Colombo",            location: "Colombo",     duration: "4 Years",   type: "Degrees",     streams: ["Arts","Commerce","Biological Science","Physical Science"], url: "https://www.cmb.ac.lk" },
  { id: "bed_peradeniya",      title: "BEd – Bachelor of Education",                             institution: "University of Peradeniya",         location: "Peradeniya",  duration: "4 Years",   type: "Degrees",     streams: ["Arts","Commerce","Biological Science","Physical Science"], url: "https://www.pdn.ac.lk" },

  // ── Engineering Technology ──
  { id: "bsc_civil_moratuwa",  title: "BSc (Hons) Civil Engineering",                            institution: "University of Moratuwa",           location: "Moratuwa",    duration: "4 Years",   type: "Degrees",     streams: ["Engineering Technology","Physical Science"],           url: "https://www.mrt.ac.lk" },
  { id: "bsc_civil_peradeniya",title: "BSc (Hons) Civil Engineering",                            institution: "University of Peradeniya",         location: "Peradeniya",  duration: "4 Years",   type: "Degrees",     streams: ["Engineering Technology","Physical Science"],           url: "https://www.pdn.ac.lk" },
  { id: "bsc_me_moratuwa",     title: "BSc (Hons) Mechanical Engineering",                       institution: "University of Moratuwa",           location: "Moratuwa",    duration: "4 Years",   type: "Degrees",     streams: ["Engineering Technology","Physical Science","Technology"], url: "https://www.mrt.ac.lk" },
  { id: "bsc_me_peradeniya",   title: "BSc (Hons) Mechanical Engineering",                       institution: "University of Peradeniya",         location: "Peradeniya",  duration: "4 Years",   type: "Degrees",     streams: ["Engineering Technology","Physical Science","Technology"], url: "https://www.pdn.ac.lk" },
  { id: "bsc_ee_moratuwa",     title: "BSc (Hons) Electrical Engineering",                       institution: "University of Moratuwa",           location: "Moratuwa",    duration: "4 Years",   type: "Degrees",     streams: ["Engineering Technology","Physical Science"],           url: "https://www.mrt.ac.lk" },
  { id: "bsc_ee_peradeniya",   title: "BSc (Hons) Electrical Engineering",                       institution: "University of Peradeniya",         location: "Peradeniya",  duration: "4 Years",   type: "Degrees",     streams: ["Engineering Technology","Physical Science"],           url: "https://www.pdn.ac.lk" },
  { id: "hnd_eng_nibm",        title: "Higher National Diploma in Engineering Technology",       institution: "NIBM",                             location: "Colombo",     duration: "2 Years",   type: "Diplomas",    streams: ["Engineering Technology","Technology"],                 url: "https://www.nibm.lk" },
];

const TYPE_FILTERS = ["All", "Degrees", "Diplomas", "NVQ", "Certificate"];
const STREAM_FILTERS = ["All Streams", "Physical Science", "Biological Science", "Commerce", "Arts", "Technology", "Engineering Technology"];

const STREAM_ICONS = {
  "Physical Science": "⚗️",
  "Biological Science": "🧬",
  "Commerce": "💼",
  "Arts": "🎨",
  "Technology": "💻",
  "Engineering Technology": "⚙️",
};

const STATS_DATA = [
  { icon: "🏛️", label: "Institutions", value: "15+" },
  { icon: "📚", label: "Programmes", value: "40+" },
  { icon: "🎓", label: "Degree Types", value: "4" },
  { icon: "🌍", label: "Locations", value: "10+" },
];

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.5s ease forwards; }
.course-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 22px 24px; transition: all 0.3s ease;
}
.course-card:hover { background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.2); transform: translateY(-2px); }
.course-card.recommended { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.04); }
.filter-btn {
  width: 100%; padding: 9px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
  background: transparent; color: rgba(226,232,240,0.55); font-size: 13px; font-weight: 500;
  cursor: pointer; font-family: Outfit, sans-serif; transition: all 0.2s ease;
  text-align: left; display: flex; align-items: center; gap: 8px;
}
.filter-btn.active { background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.35); color: #f59e0b; font-weight: 700; }
.filter-btn:hover:not(.active) { border-color: rgba(255,255,255,0.15); color: #e2e8f0; background: rgba(255,255,255,0.03); }
.type-chip {
  padding: 5px 14px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.1);
  background: transparent; color: rgba(226,232,240,0.5); font-size: 12px; font-weight: 500;
  cursor: pointer; font-family: Outfit, sans-serif; transition: all 0.2s ease; white-space: nowrap;
}
.type-chip.active { background: #f59e0b; border-color: #f59e0b; color: #020817; font-weight: 700; }
.type-chip:hover:not(.active) { border-color: rgba(245,158,11,0.4); color: #f59e0b; }
.search-input {
  width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 12px 18px 12px 44px; color: #e2e8f0; font-size: 14px;
  font-family: Outfit, sans-serif; outline: none; transition: all 0.3s ease;
}
.search-input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
.search-input::placeholder { color: rgba(226,232,240,0.3); }
.visit-btn {
  background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
  color: #f59e0b; border-radius: 6px; padding: 7px 16px;
  font-size: 12px; font-weight: 600; cursor: pointer; font-family: Outfit, sans-serif;
  transition: all 0.2s ease; text-decoration: none; display: inline-block;
}
.visit-btn:hover { background: #f59e0b; color: #020817; }
.grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: linear-gradient(rgba(245,158,11,0.03) 1px,transparent 1px),
  linear-gradient(90deg,rgba(245,158,11,0.03) 1px,transparent 1px); background-size: 40px 40px; }
.type-badge { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(226,232,240,0.5); font-size: 11px; font-weight: 600; padding: 3px 10px;
  border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase; }
.rec-badge { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.35);
  color: #f59e0b; font-size: 11px; font-weight: 700; padding: 3px 10px;
  border-radius: 100px; letter-spacing: 0.06em; }
.courses-page { width: 100vw; min-height: 100vh; background: #020817; color: #e2e8f0; font-family: Outfit, sans-serif; }
.courses-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  width: 100%;
  padding: 28px 32px 60px;
  gap: 0;
  position: relative;
  z-index: 1;
}
.sidebar { padding-right: 28px; padding-top: 4px; }
.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 14px; }
@media (max-width: 1024px) { .course-grid { grid-template-columns: 1fr !important; } }
@media (max-width: 900px) {
  .courses-layout { grid-template-columns: 1fr !important; }
  .sidebar { display: none !important; }
  .course-grid { grid-template-columns: 1fr !important; }
}
@media (max-width: 600px) {
  .courses-header-inner { flex-wrap: wrap; gap: 10px !important; }
  .courses-header-inner h1 { font-size: 15px !important; }
  .courses-layout { padding: 16px !important; }
}
`;

export default function Courses() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState("All");
  const [streamFilter, setStreamFilter] = useState("All Streams");
  const [userStream, setUserStream]     = useState(null);
  const [recommendedIds, setRecommendedIds] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const data = res.data;
        if (data.alStream) { setUserStream(data.alStream); setStreamFilter(data.alStream); }
        if (data.recommendations) {
          const ids = data.recommendations.flatMap(r => r.relatedCourseIds || []);
          setRecommendedIds([...new Set(ids)]);
        }
      } catch { /* Not logged in or no profile */ }
    };
    fetchProfile();
  }, []);

  const filtered = ALL_COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.institution.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "All" || c.type === typeFilter;
    const matchStream = streamFilter === "All Streams" || c.streams.includes(streamFilter);
    return matchSearch && matchType && matchStream;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aRec    = recommendedIds.includes(a.id) ? 2 : 0;
    const bRec    = recommendedIds.includes(b.id) ? 2 : 0;
    const aStream = userStream && a.streams.includes(userStream) ? 1 : 0;
    const bStream = userStream && b.streams.includes(userStream) ? 1 : 0;
    return (bRec + bStream) - (aRec + aStream);
  });

  const recommendedCount = sorted.filter(c => recommendedIds.includes(c.id)).length;

  // Count by type for sidebar
  const typeCounts = TYPE_FILTERS.reduce((acc, f) => {
    acc[f] = f === "All" ? ALL_COURSES.length : ALL_COURSES.filter(c => c.type === f).length;
    return acc;
  }, {});

  return (
    <div className="courses-page">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="grid-bg" />

      {/* ── STICKY HEADER ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(2,8,23,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px" }}>
        <div className="courses-header-inner" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#e2e8f0", fontSize: 15, flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em" }}>
              {t('coursesTitle')}
            </h1>
            <p style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", marginTop: 1 }}>
              {userStream ? `${userStream}` : t('allTypes')}
              {recommendedIds.length > 0 && ` • ${recommendedCount} ${t('recommended')}`}
            </p>
          </div>
          {userStream && (
            <span style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>
              {userStream}
            </span>
          )}
          <LangSwitcher style={{ flexShrink: 0 }} />
        </div>
      </div>

      {/* ── BODY: sidebar + main ── */}
      <div className="courses-layout">

        {/* ── LEFT SIDEBAR ── */}
        <div className="sidebar">

          {/* Quick stats */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 16px", marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>📊 Database</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {STATS_DATA.map((s, i) => (
                <div key={i} style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 8, padding: "10px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b", lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "rgba(226,232,240,0.4)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stream filter */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(226,232,240,0.4)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>A/L Stream</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {STREAM_FILTERS.map(sf => (
                <button key={sf} className={`filter-btn${streamFilter === sf ? " active" : ""}`} onClick={() => setStreamFilter(sf)}>
                  <span style={{ fontSize: 15 }}>{STREAM_ICONS[sf] || "📋"}</span>
                  <span style={{ fontSize: 12 }}>{sf}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(226,232,240,0.4)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Programme Type</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TYPE_FILTERS.map(f => (
                <button key={f} className={`filter-btn${typeFilter === f ? " active" : ""}`} onClick={() => setTypeFilter(f)}>
                  <span style={{ flex: 1, fontSize: 12 }}>{f}</span>
                  <span style={{ fontSize: 11, color: "rgba(226,232,240,0.3)", background: "rgba(255,255,255,0.05)", borderRadius: 100, padding: "1px 8px" }}>{typeCounts[f]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tips card */}
          <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: "16px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em" }}>💡 Quick Tip</p>
            <p style={{ fontSize: 12, color: "rgba(226,232,240,0.55)", lineHeight: 1.7 }}>
              Recommended courses are personalised based on your AI career matches and A/L stream.
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ minWidth: 0 }}>

          {/* Search */}
          <div className="fade-up" style={{ position: "relative", marginBottom: 14 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "rgba(226,232,240,0.3)", pointerEvents: "none" }}>🔍</span>
            <input className="search-input" placeholder={t('searchCourses')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Mobile type chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
            {TYPE_FILTERS.map(f => (
              <button key={f} className={`type-chip${typeFilter === f ? " active" : ""}`} onClick={() => setTypeFilter(f)}>{f}</button>
            ))}
          </div>

          {/* Count row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <p style={{ fontSize: 13, color: "rgba(226,232,240,0.4)" }}>
              Showing <strong style={{ color: "#f59e0b" }}>{sorted.length}</strong> programme{sorted.length !== 1 ? "s" : ""}
              {recommendedIds.length > 0 && <span style={{ color: "#f59e0b" }}> • ⭐ = {t('recommended')}</span>}
            </p>
            {(search || typeFilter !== "All" || streamFilter !== "All Streams") && (
              <button onClick={() => { setSearch(""); setTypeFilter("All"); setStreamFilter("All Streams"); }}
                style={{ background: "none", border: "none", color: "rgba(245,158,11,0.7)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit,sans-serif" }}>
                ✕ {t('clearFilter')}
              </button>
            )}
          </div>

          {/* Course cards */}
          <div className="course-grid">
            {sorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(226,232,240,0.3)" }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{t('noCourses')}</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Try a different search or filter</p>
                <button onClick={() => { setSearch(""); setTypeFilter("All"); setStreamFilter("All Streams"); }}
                  style={{ marginTop: 20, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit,sans-serif" }}>
                  {t('clearFilter')}
                </button>
              </div>
            ) : (
              sorted.map((course, i) => {
                const isRec = recommendedIds.includes(course.id);
                const matchesUser = userStream && course.streams.includes(userStream);
                return (
                  <div
                    key={course.id}
                    className={`course-card${isRec ? " recommended" : ""}`}
                    style={{ opacity: 0, animation: `fadeUp 0.45s ease ${Math.min(i * 0.04, 0.6)}s forwards` }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.35 }}>{course.title}</h3>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {isRec && <span className="rec-badge">⭐ {t('recommended')}</span>}
                        <span className="type-badge">{course.type}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: "rgba(226,232,240,0.7)", marginBottom: 10, fontWeight: 600 }}>{course.institution}</p>

                    <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "rgba(226,232,240,0.4)", display: "flex", alignItems: "center", gap: 4 }}>📍 {course.location}</span>
                      <span style={{ fontSize: 12, color: "rgba(226,232,240,0.4)", display: "flex", alignItems: "center", gap: 4 }}>⏱ {course.duration}</span>
                      {matchesUser && (
                        <span style={{ fontSize: 12, color: "#f59e0b", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>✓ {t('matchesStream')}</span>
                      )}
                    </div>

                    {/* Stream tags */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {course.streams.map(s => (
                        <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: s === userStream ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${s === userStream ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`, color: s === userStream ? "#f59e0b" : "rgba(226,232,240,0.35)", fontWeight: 600 }}>
                          {STREAM_ICONS[s] || ""} {s}
                        </span>
                      ))}
                    </div>

                    <a href={course.url} target="_blank" rel="noreferrer" className="visit-btn">Visit Institution →</a>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
