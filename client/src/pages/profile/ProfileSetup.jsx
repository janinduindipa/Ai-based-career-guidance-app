import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage, LangSwitcher } from "../../context/LanguageContext";
import api from "../../services/api";

const OL_SUBJECTS    = ["Mathematics","Science","English","Sinhala","Tamil","History","Geography","Commerce","Art","ICT"];
const OL_GRADES      = ["A","B","C","S","W"];
const AL_GRADES      = ["A","B","C","S","W"];
const SKILLS_LIST    = ["Programming","Mathematics","Communication","Creativity","Team Work","Writing","Leadership","Research","Problem Solving","Data Analysis","Public Speaking","Project Management"];
const INTERESTS_LIST = ["Technology","Medicine","Law","Business","Education","Engineering","Arts & Design","Science","Finance","Social Work","Media","Environment","Sports","Hospitality"];
const STREAM_COLORS  = {
  "Physical Science":"#60a5fa","Biological Science":"#34d399","Commerce":"#a78bfa",
  "Arts":"#f472b6","Technology":"#f59e0b","Engineering Technology":"#fb923c",
};

// All Sri Lankan A/L subjects — students pick any combination (not locked to a stream)
const AL_SUBJECT_GROUPS = [
  { category:"Mathematics & Sciences", color:"#60a5fa", emoji:"🔬",
    subjects:["Combined Mathematics","Physics","Chemistry","Biology","Agriculture"] },
  { category:"Technology", color:"#f59e0b", emoji:"💻",
    subjects:["ICT","Engineering Technology","Science for Technology"] },
  { category:"Commerce", color:"#a78bfa", emoji:"💼",
    subjects:["Business Studies","Accounting","Economics"] },
  { category:"Arts & Humanities", color:"#f472b6", emoji:"🎨",
    subjects:["Sinhala","Tamil","English","History","Geography","Political Science","Logic & Scientific Method","Drama & Theatre","Art","Music"] },
];

// Derive the stream family automatically from the chosen subjects
function detectStream(subjects) {
  if (!subjects || subjects.length === 0) return '';
  const s = new Set(subjects);
  if (s.has("Combined Mathematics")) {
    if (s.has("Engineering Technology") || s.has("Science for Technology")) return "Engineering Technology";
    if (s.has("ICT")) return "Technology";
    if (s.has("Biology") || s.has("Agriculture")) return "Biological Science";
    return "Physical Science";
  }
  if (s.has("Biology") || s.has("Agriculture")) return "Biological Science";
  if (s.has("Business Studies") || s.has("Accounting") || s.has("Economics")) return "Commerce";
  if (s.has("Engineering Technology") || s.has("Science for Technology")) return "Engineering Technology";
  if (s.has("ICT")) return "Technology";
  const arts = ["Sinhala","Tamil","English","History","Geography","Political Science","Logic & Scientific Method","Drama & Theatre","Art","Music"];
  if (subjects.some(sub => arts.includes(sub))) return "Arts";
  return "";
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
.fade-up{animation:fadeUp .5s ease both}
.fade-in{animation:fadeIn .4s ease both}
.shimmer-text{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(245,158,11,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,.025) 1px,transparent 1px);background-size:50px 50px}
.drop-zone{border:2px dashed rgba(245,158,11,.35);border-radius:20px;cursor:pointer;transition:all .3s;background:rgba(245,158,11,.03)}
.drop-zone:hover,.drop-zone.dragging{border-color:#f59e0b;background:rgba(245,158,11,.07)}
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:24px 28px;margin-bottom:16px}
.card-label{font-size:11px;font-weight:700;color:rgba(226,232,240,.4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.input-field,.select-field{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 16px;color:#e2e8f0;font-family:Outfit,sans-serif;font-size:14px;outline:none;transition:border-color .2s}
.input-field:focus,.select-field:focus{border-color:rgba(245,158,11,.5)}
.select-field option{background:#0f172a;color:#e2e8f0}
.tag-btn{padding:8px 16px;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:rgba(226,232,240,.6);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;font-family:Outfit,sans-serif;margin:4px}
.tag-btn:hover{border-color:rgba(245,158,11,.4);color:#f59e0b}
.tag-btn.active{background:rgba(245,158,11,.15);border-color:rgba(245,158,11,.5);color:#f59e0b;font-weight:700}
.tag-btn.ai{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.4);color:#a5b4fc;font-weight:700}
.grade-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:100px;font-size:13px;color:#e2e8f0;margin:3px}
.stream-pill{display:inline-block;padding:7px 16px;border-radius:100px;font-size:13px;font-weight:600;margin:4px;cursor:pointer;transition:all .2s;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:rgba(226,232,240,.5)}
.stream-pill:hover{opacity:.85}
.btn-primary{background:#f59e0b;color:#020817;border:none;border-radius:12px;padding:14px 28px;font-size:15px;font-weight:800;cursor:pointer;font-family:Outfit,sans-serif;transition:all .25s;width:100%}
.btn-primary:hover:not(:disabled){background:#fbbf24;transform:translateY(-1px)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed}
.btn-ghost{background:rgba(255,255,255,.05);color:rgba(226,232,240,.7);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s;width:100%}
.btn-ghost:hover{background:rgba(255,255,255,.09)}
.from-badge{display:inline-block;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:#86efac;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;margin-left:6px;vertical-align:middle;text-transform:uppercase}
.nav-bar{position:sticky;top:0;z-index:100;background:rgba(2,8,23,.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.07)}
.progress-bar{height:2px;background:rgba(255,255,255,.06)}
.progress-fill{height:100%;background:linear-gradient(90deg,#f59e0b,#fde68a);transition:width .6s ease}
@media(max-width:900px){.choose-split{flex-direction:column!important}}
@media(max-width:600px){.card{padding:16px 14px}.btn-primary,.btn-ghost{font-size:13px}}
`;

const Spinner = () => (
  <div style={{width:17,height:17,border:'2px solid rgba(2,8,23,.3)',borderTopColor:'#020817',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block',marginRight:8,verticalAlign:'middle'}}/>
);

/* ── Nav lives outside ProfileSetup so it never re-creates on state change ── */
function ProfileNav({ mode, step, progress }) {
  return (
    <div className="nav-bar">
      <div style={{display:'flex',alignItems:'center',padding:'12px 32px',gap:20}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <div style={{width:32,height:32,background:'#f59e0b',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:16,color:'#020817'}}>C</div>
          <span style={{fontWeight:700,fontSize:15,letterSpacing:'-0.02em'}}>CareerAI<span style={{color:'#f59e0b'}}>.</span>lk</span>
        </div>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          {[{label:'Upload CV',done:mode!=='choose'},{label:'Details',done:mode==='review'||(mode==='manual'&&step>1)},{label:'Save',done:false}].map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:100,background:s.done?'rgba(245,158,11,.1)':'transparent'}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:s.done?'#f59e0b':'rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:s.done?'#020817':'rgba(226,232,240,.35)',flexShrink:0}}>{s.done?'✓':i+1}</div>
                <span style={{fontSize:11,color:s.done?'#f59e0b':'rgba(226,232,240,.35)',fontWeight:s.done?700:400}}>{s.label}</span>
              </div>
              {i<2 && <div style={{width:24,height:1,background:'rgba(255,255,255,.08)'}}/>}
            </div>
          ))}
        </div>
        <LangSwitcher/>
      </div>
      {(mode==='manual'||mode==='review') && (
        <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
      )}
    </div>
  );
}

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  useLanguage(); // i18n context — language switching wired up
  const fileRef = useRef(null);

  const [mode,       setMode]       = useState('choose');
  const [step,       setStep]       = useState(1);
  const [saving,     setSaving]     = useState(false);
  const [saveErr,    setSaveErr]    = useState('');
  const [dragging,   setDragging]   = useState(false);
  const [cvFromAI,   setCvFromAI]   = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  const [cvError,    setCvError]    = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const [olResults,   setOlResults]   = useState({});
  const [alSubjects,  setAlSubjects]  = useState([]);   // individual subject names picked
  const [alResults,   setAlResults]   = useState({});   // subject → grade
  const [skills,      setSkills]      = useState([]);
  const [interests,   setInterests]   = useState([]);
  const [fullName,    setFullName]    = useState(user?.displayName || '');
  const [summary,     setSummary]     = useState('');
  const [olSubject,   setOlSubject]   = useState('');
  const [olGrade,     setOlGrade]     = useState('');
  const [customSub,   setCustomSub]   = useState('');   // custom A/L subject input

  // alStream derived — never stored separately — never stored separately
  const alStream = detectStream(alSubjects);

  /* ── Pre-load existing profile on mount ── */
  useEffect(() => {
    api.get('/users/profile').then(res => {
      const d = res.data;
      if (!d.profileComplete) return; // new user — stay on choose screen
      // Pre-fill all fields from saved profile
      if (d.displayName) setFullName(d.displayName);
      // Restore alSubjects: prefer saved array, fall back to alResults keys (backward compat)
      if (d.alSubjects?.length)                            setAlSubjects(d.alSubjects);
      else if (d.alResults && Object.keys(d.alResults).length) setAlSubjects(Object.keys(d.alResults));
      if (d.alResults && Object.keys(d.alResults).length) setAlResults(d.alResults);
      if (d.olResults && Object.keys(d.olResults).length) setOlResults(d.olResults);
      if (d.skills?.length)    setSkills(d.skills);
      if (d.interests?.length) setInterests(d.interests);
      setIsEditMode(true);
      setMode('review');
    }).catch(() => {
      // New user or auth error — stay on choose screen
    });
  }, []);

  const addOlResult    = () => { if (olSubject && olGrade) { setOlResults(p=>({...p,[olSubject]:olGrade})); setOlSubject(''); setOlGrade(''); }};
  const removeOl       = s  => { const n={...olResults}; delete n[s]; setOlResults(n); };
  const toggleSkill    = s  => setSkills(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const toggleInterest = i  => setInterests(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  const progress       = mode==='manual' ? Math.round((step/3)*100) : mode==='review' ? 100 : 0;

  const toggleSubject = (sub) => {
    setAlSubjects(prev => {
      if (prev.includes(sub)) {
        // Deselect → also clear its grade
        setAlResults(r => { const n={...r}; delete n[sub]; return n; });
        return prev.filter(s => s !== sub);
      }
      return [...prev, sub];
    });
  };

  const addCustomSubject = () => {
    const s = customSub.trim();
    if (!s || alSubjects.includes(s)) { setCustomSub(''); return; }
    setAlSubjects(prev => [...prev, s]);
    setCustomSub('');
  };

  // Completeness hints — which sections are missing data
  const missing = [
    !fullName?.trim()           && 'Full Name',
    alSubjects.length === 0     && 'A/L Subjects',
    alSubjects.some(s => !alResults[s]) && alSubjects.length > 0 && 'A/L Grades',
    Object.keys(olResults).length === 0 && 'O/L Results (optional)',
    skills.length < 2           && 'Skills (select at least 2)',
    interests.length < 2        && 'Interests (select at least 2)',
  ].filter(Boolean);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (file.size > 10*1024*1024) { setCvError('File must be under 10MB'); return; }
    setCvFileName(file.name); setCvError('');
    setMode('uploading');
    const fd = new FormData();
    fd.append('cv', file);
    try {
      const res = await api.post('/cv/parse', fd, { headers:{'Content-Type':'multipart/form-data'} });
      const { data, geminiWorked } = res.data;
      if (data.fullName)  setFullName(data.fullName);
      if (data.alResults && Object.keys(data.alResults).length) {
        setAlResults(data.alResults);
        // Derive alSubjects from parsed A/L result keys
        setAlSubjects(prev => {
          const parsed = Object.keys(data.alResults);
          const merged = [...new Set([...prev, ...parsed])];
          return merged;
        });
      }
      if (data.olResults && Object.keys(data.olResults).length) setOlResults(data.olResults);
      if (data.skills?.length)    setSkills(data.skills);
      if (data.interests?.length) setInterests(data.interests);
      if (data.summary)  setSummary(data.summary);
      setCvFromAI(!!geminiWorked);
      setMode('review');
    } catch(err) {
      console.error('[CV Upload Error]', err.response?.status, err.response?.data, err.message);
      const msg = err.response?.data?.error
        || (err.message === 'Network Error' ? 'Cannot connect to server. Please check the backend is running.' : null)
        || 'Could not read CV. Try a different file or fill manually.';
      setCvError(msg);
      setMode('choose');
    }
  }, []);

  const onDrop  = e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer?.files[0]); };
  const onInput = e => handleFile(e.target.files[0]);

  const saveProfile = async () => {
    setSaving(true); setSaveErr('');
    try {
      await api.put('/users/profile', { displayName:fullName||user?.displayName||'', alStream, alSubjects, alResults, olResults, skills, interests });
      await refreshProfile();
      navigate('/dashboard');
    } catch(err) {
      setSaveErr(err.response?.data?.error || 'Failed to save. Try again.');
      setSaving(false);
    }
  };

  return (
    <div style={{fontFamily:'Outfit,sans-serif',background:'#020817',color:'#e2e8f0',minHeight:'100vh',width:'100vw',display:'flex',flexDirection:'column',overflowX:'hidden'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{CSS}</style>
      <div className="grid-bg"/>
      <ProfileNav mode={mode} step={step} progress={progress}/>

      {/* ══ CHOOSE MODE ══ */}
      {mode==='choose' && (
        <div className="choose-split fade-in" style={{flex:1,display:'flex',width:'100%',minHeight:0}}>

          {/* LEFT — drop zone */}
          <div style={{flex:'0 0 52%',display:'flex',flexDirection:'column',justifyContent:'flex-start',padding:'48px 40px 48px 48px',borderRight:'1px solid rgba(255,255,255,.06)',overflowY:'auto'}}>
            <div style={{width:'100%'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.25)',borderRadius:100,padding:'5px 14px',marginBottom:20,fontSize:11,fontWeight:700,color:'#f59e0b',letterSpacing:'.1em',textTransform:'uppercase'}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:'#f59e0b'}}/>Gemini AI — Instant Setup
              </div>
              <h1 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:900,letterSpacing:'-0.04em',marginBottom:10,lineHeight:1.1}}>
                <span className="shimmer-text">Upload Your CV</span>
              </h1>
              <p style={{fontSize:15,color:'rgba(226,232,240,.5)',marginBottom:32,lineHeight:1.7}}>
                AI reads your CV in seconds and fills your entire profile automatically — name, stream, skills, interests.
              </p>

              <div
                className={`drop-zone${dragging?' dragging':''}`}
                onClick={()=>fileRef.current?.click()}
                onDragOver={e=>{e.preventDefault();setDragging(true)}}
                onDragLeave={()=>setDragging(false)}
                onDrop={onDrop}
                style={{padding:'44px 32px',textAlign:'center',marginBottom:20}}
              >
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp" onChange={onInput} style={{display:'none'}}/>
                <div style={{fontSize:48,marginBottom:16}}>📄</div>
                <h3 style={{fontSize:18,fontWeight:800,marginBottom:8}}>Drop your CV here</h3>
                <p style={{fontSize:13,color:'rgba(226,232,240,.4)',marginBottom:20}}>PDF, DOCX, JPG, PNG — max 10 MB</p>
                <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(245,158,11,.12)',border:'1.5px solid rgba(245,158,11,.4)',color:'#f59e0b',borderRadius:100,padding:'10px 28px',fontSize:14,fontWeight:700,cursor:'pointer'}}>
                  ✦ Click to Browse
                </div>
                {cvError && (
                  <div style={{marginTop:16,background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,padding:'10px 16px',fontSize:13,color:'#fca5a5'}}>⚠️ {cvError}</div>
                )}
              </div>

              <div style={{display:'flex',alignItems:'center',gap:14,margin:'16px 0'}}>
                <div style={{flex:1,height:1,background:'rgba(255,255,255,.07)'}}/>
                <span style={{fontSize:12,color:'rgba(226,232,240,.3)',fontWeight:600}}>OR</span>
                <div style={{flex:1,height:1,background:'rgba(255,255,255,.07)'}}/>
              </div>
              <button className="btn-ghost" onClick={()=>setMode('manual')}>📝 Fill in details manually instead</button>
            </div>
          </div>

          {/* RIGHT — features info */}
          <div style={{flex:'0 0 48%',display:'flex',flexDirection:'column',justifyContent:'flex-start',padding:'48px 48px 48px 40px',background:'rgba(245,158,11,.02)',overflowY:'auto'}}>
            <div style={{width:'100%'}}>
              <p style={{fontSize:11,fontWeight:700,color:'#f59e0b',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:24}}>⚡ What AI Extracts From Your CV</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:36}}>
                {[
                  {icon:'👤',title:'Full Name',sub:'Automatically detected'},
                  {icon:'🎓',title:'A/L Stream',sub:'Inferred from degree/field'},
                  {icon:'📊',title:'A/L Grades',sub:'Subject results filled in'},
                  {icon:'📝',title:'O/L Results',sub:'GCE O/L records read'},
                  {icon:'⚡',title:'Skills',sub:'From experience & projects'},
                  {icon:'🎯',title:'Interests',sub:'Career inclinations mapped'},
                ].map((item,i)=>(
                  <div key={i} style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:'14px 16px'}}>
                    <div style={{fontSize:24,marginBottom:8}}>{item.icon}</div>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{item.title}</div>
                    <div style={{fontSize:11,color:'rgba(226,232,240,.4)'}}>{item.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'20px 22px',marginBottom:16}}>
                <p style={{fontSize:11,fontWeight:700,color:'rgba(226,232,240,.4)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14}}>🚀 How It Works</p>
                {[
                  {n:'01',t:'Upload your CV (PDF or image)'},
                  {n:'02',t:'Gemini AI reads and extracts your details'},
                  {n:'03',t:'Review and confirm — edit anything'},
                  {n:'04',t:'Get matched to top career paths & courses'},
                ].map((s,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:12,marginBottom:i<3?10:0}}>
                    <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(245,158,11,.12)',border:'1px solid rgba(245,158,11,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#f59e0b',flexShrink:0}}>{s.n}</div>
                    <span style={{fontSize:13,color:'rgba(226,232,240,.65)'}}>{s.t}</span>
                  </div>
                ))}
              </div>

              <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'14px 16px',background:'rgba(245,158,11,.04)',border:'1px solid rgba(245,158,11,.12)',borderRadius:12}}>
                <span style={{fontSize:20,flexShrink:0}}>🔒</span>
                <p style={{fontSize:12,color:'rgba(226,232,240,.45)',lineHeight:1.6}}><strong style={{color:'#f59e0b'}}>Privacy first.</strong> Your CV is read once by AI and immediately discarded. Only the extracted data is saved.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ UPLOADING MODE ══ */}
      {mode==='uploading' && (
        <div className="fade-in" style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'40px'}}>
          <div style={{width:88,height:88,border:'3px solid rgba(245,158,11,.2)',borderTopColor:'#f59e0b',borderRadius:'50%',animation:'spin .8s linear infinite',marginBottom:28}}/>
          <h3 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Gemini AI is reading your CV…</h3>
          <p style={{fontSize:13,color:'rgba(226,232,240,.4)',marginBottom:4}}>{cvFileName}</p>
          <p style={{fontSize:13,color:'rgba(245,158,11,.6)',animation:'pulse 1.5s ease infinite',marginTop:8}}>Extracting your details…</p>
          <div style={{display:'flex',gap:20,marginTop:32,flexWrap:'wrap',justifyContent:'center'}}>
            {['Reading file…','Analysing…','Finding skills…','Building profile…'].map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(226,232,240,.3)',animation:`pulse 1.5s ease ${i*.3}s infinite`}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#f59e0b'}}/>{s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ REVIEW MODE ══ */}
      {mode==='review' && (
        <div style={{flex:1,padding:'32px 48px 60px',overflowY:'auto'}}>
          <div>

            {/* Banner — edit mode vs CV uploaded */}
            {isEditMode ? (
              <div className="fade-up" style={{background:'rgba(99,102,241,.07)',border:'1px solid rgba(99,102,241,.2)',borderRadius:12,padding:'14px 20px',marginBottom:24,display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:22}}>✏️</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:14,fontWeight:700,color:'#a5b4fc',marginBottom:2}}>Editing your existing profile — all saved data has been loaded.</p>
                  <p style={{fontSize:12,color:'rgba(226,232,240,.4)'}}>Make any changes and save to update your career matches.</p>
                </div>
                <button onClick={()=>{ setIsEditMode(false); setMode('choose'); }} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.6)',borderRadius:8,padding:'7px 14px',fontSize:12,cursor:'pointer',fontFamily:'Outfit,sans-serif',flexShrink:0}}>← Re-upload CV</button>
              </div>
            ) : (
              <div className="fade-up" style={{background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.2)',borderRadius:12,padding:'14px 20px',marginBottom:24,display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:22}}>🎉</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:14,fontWeight:700,color:'#86efac',marginBottom:2}}>{cvFromAI?'CV analysed by AI — review your details below.':'CV uploaded. Please complete any missing fields.'}</p>
                  <p style={{fontSize:12,color:'rgba(226,232,240,.4)'}}>All fields are editable before saving.</p>
                </div>
                <button onClick={()=>setMode('choose')} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(226,232,240,.6)',borderRadius:8,padding:'7px 14px',fontSize:12,cursor:'pointer',fontFamily:'Outfit,sans-serif',flexShrink:0}}>← Re-upload</button>
              </div>
            )}

            {/* AI Summary */}
            {summary && (
              <div className="card fade-up" style={{background:'rgba(245,158,11,.04)',border:'1px solid rgba(245,158,11,.15)'}}>
                <p className="card-label">🤖 AI Career Summary</p>
                <p style={{fontSize:14,color:'rgba(226,232,240,.75)',lineHeight:1.8,fontStyle:'italic'}}>"{summary}"</p>
              </div>
            )}

            {/* Completeness hints */}
            {missing.length > 0 && (
              <div className="fade-up" style={{background:'rgba(245,158,11,.06)',border:'1px solid rgba(245,158,11,.2)',borderRadius:12,padding:'12px 18px',marginBottom:18,display:'flex',alignItems:'flex-start',gap:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📋</span>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:'#f59e0b',marginBottom:4}}>Complete your profile to improve career matches:</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {missing.map(m=>(
                      <span key={m} style={{background:'rgba(245,158,11,.12)',border:'1px solid rgba(245,158,11,.25)',color:'#fde68a',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:100}}>⚠️ {m}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Name + A/L Subjects */}
            <div className="card fade-up" style={{animationDelay:'.04s'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div>
                  <p className="card-label">👤 Full Name {fullName&&<span className="from-badge">Filled</span>}</p>
                  <input className="input-field" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Enter your full name"/>
                </div>
                <div>
                  <p className="card-label">🎓 Detected Stream</p>
                  {alStream
                    ? <div style={{display:'inline-flex',alignItems:'center',gap:8,background:STREAM_COLORS[alStream]+'22',border:`1px solid ${STREAM_COLORS[alStream]}55`,borderRadius:100,padding:'7px 16px'}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:STREAM_COLORS[alStream]}}/>
                        <span style={{fontSize:13,fontWeight:700,color:STREAM_COLORS[alStream]}}>{alStream}</span>
                      </div>
                    : <p style={{fontSize:12,color:'rgba(226,232,240,.3)',marginTop:4}}>Select subjects below to auto-detect</p>
                  }
                </div>
              </div>

              <p className="card-label">📚 A/L Subjects <span style={{fontWeight:400,textTransform:'none',letterSpacing:'normal',color:'rgba(226,232,240,.4)',fontSize:11}}> — pick your actual subjects (any combination)</span></p>
              {AL_SUBJECT_GROUPS.map(group => (
                <div key={group.category} style={{marginBottom:12}}>
                  <p style={{fontSize:10,fontWeight:700,color:group.color,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:6}}>{group.emoji} {group.category}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                    {group.subjects.map(sub => {
                      const active = alSubjects.includes(sub);
                      return (
                        <button key={sub} onClick={()=>toggleSubject(sub)}
                          style={{padding:'6px 14px',borderRadius:100,border:`1.5px solid ${active?group.color:'rgba(255,255,255,.1)'}`,
                            background:active?group.color+'22':'rgba(255,255,255,.03)',
                            color:active?group.color:'rgba(226,232,240,.55)',
                            fontSize:12,fontWeight:active?700:400,cursor:'pointer',transition:'all .2s',fontFamily:'Outfit,sans-serif'}}>
                          {active?'✓ ':''}{sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Custom subject input */}
              <div style={{display:'flex',gap:8,marginTop:4}}>
                <input className="input-field" value={customSub} onChange={e=>setCustomSub(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&addCustomSubject()}
                  placeholder="+ Add a custom subject (e.g. Home Economics)" style={{flex:1,padding:'9px 14px'}}/>
                <button onClick={addCustomSubject}
                  style={{background:'rgba(245,158,11,.15)',border:'1px solid rgba(245,158,11,.3)',color:'#f59e0b',borderRadius:10,padding:'0 16px',fontWeight:700,cursor:'pointer',fontFamily:'Outfit,sans-serif',flexShrink:0,fontSize:13}}>Add</button>
              </div>

              {/* Selected subjects summary */}
              {alSubjects.length > 0 && (
                <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid rgba(255,255,255,.06)'}}>
                  <p style={{fontSize:11,color:'rgba(226,232,240,.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Selected ({alSubjects.length}) — click to remove</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                    {alSubjects.map(sub=>(
                      <button key={sub} onClick={()=>toggleSubject(sub)}
                        style={{display:'flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:100,background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.25)',color:'#f59e0b',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Outfit,sans-serif'}}>
                        {sub} <span style={{fontSize:14,lineHeight:1}}>×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* A/L Subject Grades */}
            {alSubjects.length > 0 && (
              <div className="card fade-up" style={{animationDelay:'.08s'}}>
                <p className="card-label">📊 A/L Subject Grades {Object.values(alResults).some(Boolean)&&<span className="from-badge">From CV</span>}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                  {alSubjects.map(sub=>(
                    <div key={sub} style={{display:'flex',flexDirection:'column',gap:4,flex:'1 1 160px'}}>
                      <label style={{fontSize:11,color:'rgba(226,232,240,.45)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{sub}</label>
                      <select className="select-field" value={alResults[sub]||''} onChange={e=>setAlResults(p=>({...p,[sub]:e.target.value}))}>
                        <option value="">— Grade</option>{AL_GRADES.map(g=><option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* O/L Results */}
            <div className="card fade-up" style={{animationDelay:'.12s'}}>
              <p className="card-label">📝 O/L Results {Object.keys(olResults).length>0&&<span className="from-badge">From CV</span>}</p>
              {Object.entries(olResults).length>0&&(
                <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:14}}>
                  {Object.entries(olResults).map(([s,g])=>(
                    <div key={s} className="grade-badge">{s}: <strong style={{color:'#f59e0b'}}>{g}</strong>
                      <button onClick={()=>removeOl(s)} style={{background:'none',border:'none',color:'rgba(226,232,240,.4)',cursor:'pointer',padding:'0 0 0 4px',fontSize:14,lineHeight:1}}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:'flex',gap:8}}>
                <select className="select-field" value={olSubject} onChange={e=>setOlSubject(e.target.value)} style={{flex:2}}>
                  <option value="">Select subject</option>{OL_SUBJECTS.filter(s=>!olResults[s]).map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <select className="select-field" value={olGrade} onChange={e=>setOlGrade(e.target.value)} style={{flex:1}}>
                  <option value="">Grade</option>{OL_GRADES.map(g=><option key={g} value={g}>{g}</option>)}
                </select>
                <button onClick={addOlResult} style={{background:'#f59e0b',color:'#020817',border:'none',borderRadius:10,padding:'0 18px',fontWeight:700,cursor:'pointer',fontFamily:'Outfit,sans-serif',flexShrink:0}}>Add</button>
              </div>
            </div>

            {/* Skills + Interests */}
            <div className="fade-up" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16,animationDelay:'.16s'}}>
              <div className="card" style={{margin:0}}>
                <p className="card-label">⚡ Skills {skills.length>0&&<span className="from-badge">AI found {skills.length}</span>}</p>
                <div style={{display:'flex',flexWrap:'wrap'}}>
                  {SKILLS_LIST.map(s=><button key={s} className={`tag-btn${skills.includes(s)?' active':''}`} onClick={()=>toggleSkill(s)}>{s}</button>)}
                </div>
              </div>
              <div className="card" style={{margin:0}}>
                <p className="card-label">🎯 Interests {interests.length>0&&<span className="from-badge" style={{background:'rgba(99,102,241,.1)',borderColor:'rgba(99,102,241,.3)',color:'#a5b4fc'}}>AI found {interests.length}</span>}</p>
                <div style={{display:'flex',flexWrap:'wrap'}}>
                  {INTERESTS_LIST.map(i=><button key={i} className={`tag-btn${interests.includes(i)?' ai':''}`} onClick={()=>toggleInterest(i)}>{i}</button>)}
                </div>
              </div>
            </div>

            <div style={{padding:'12px 16px',background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.06)',borderRadius:10,marginBottom:20,fontSize:12,color:'rgba(226,232,240,.35)'}}>
              🔒 Your CV was never stored — only the extracted details above are saved.
            </div>

            {saveErr&&<div style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,padding:'12px 16px',marginBottom:16,fontSize:13,color:'#fca5a5'}}>⚠️ {saveErr}</div>}
            <button className="btn-primary fade-up" style={{animationDelay:'.2s',fontSize:16,padding:'17px',borderRadius:14}} onClick={saveProfile} disabled={saving||alSubjects.length===0}>
              {saving?<><Spinner/>Saving…</>:'🎯 Save Profile & See My Career Matches →'}
            </button>
          </div>
        </div>
      )}

      {/* ══ MANUAL MODE ══ */}
      {mode==='manual' && (
        <div style={{flex:1,padding:'40px 48px 60px',overflowY:'auto'}}>
          <div>
            <div className="fade-up" style={{marginBottom:24}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:11,color:'rgba(226,232,240,.4)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Step {step} of 3</span>
                <button onClick={()=>setMode('choose')} style={{background:'none',border:'none',color:'rgba(226,232,240,.4)',cursor:'pointer',fontSize:12,fontFamily:'Outfit,sans-serif'}}>← Upload CV instead</button>
              </div>
              <h2 style={{fontSize:'clamp(22px,4vw,30px)',fontWeight:900,letterSpacing:'-0.03em'}}>
                {step===1?'📚 Your Education':step===2?'⚡ Your Skills':'🎯 Your Interests'}
              </h2>
            </div>

            {step===1 && (
              <div>
                <div className="card fade-up">
                  {/* Detected stream badge */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                    <p className="card-label" style={{margin:0}}>📚 A/L Subjects <span style={{color:'#f59e0b'}}>*</span></p>
                    {alStream && (
                      <div style={{display:'inline-flex',alignItems:'center',gap:6,background:STREAM_COLORS[alStream]+'22',border:`1px solid ${STREAM_COLORS[alStream]}55`,borderRadius:100,padding:'4px 12px'}}>
                        <div style={{width:6,height:6,borderRadius:'50%',background:STREAM_COLORS[alStream]}}/>
                        <span style={{fontSize:11,fontWeight:700,color:STREAM_COLORS[alStream]}}>{alStream}</span>
                      </div>
                    )}
                  </div>

                  {AL_SUBJECT_GROUPS.map(group => (
                    <div key={group.category} style={{marginBottom:10}}>
                      <p style={{fontSize:10,fontWeight:700,color:group.color,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:5}}>{group.emoji} {group.category}</p>
                      <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                        {group.subjects.map(sub => {
                          const active = alSubjects.includes(sub);
                          return (
                            <button key={sub} onClick={()=>toggleSubject(sub)}
                              style={{padding:'6px 14px',borderRadius:100,border:`1.5px solid ${active?group.color:'rgba(255,255,255,.1)'}`,
                                background:active?group.color+'22':'rgba(255,255,255,.03)',
                                color:active?group.color:'rgba(226,232,240,.55)',
                                fontSize:12,fontWeight:active?700:400,cursor:'pointer',transition:'all .2s',fontFamily:'Outfit,sans-serif'}}>
                              {active?'✓ ':''}{sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Custom subject */}
                  <div style={{display:'flex',gap:8,marginTop:8}}>
                    <input className="input-field" value={customSub} onChange={e=>setCustomSub(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&addCustomSubject()}
                      placeholder="+ Add a custom subject" style={{flex:1,padding:'9px 14px'}}/>
                    <button onClick={addCustomSubject}
                      style={{background:'rgba(245,158,11,.15)',border:'1px solid rgba(245,158,11,.3)',color:'#f59e0b',borderRadius:10,padding:'0 16px',fontWeight:700,cursor:'pointer',fontFamily:'Outfit,sans-serif',flexShrink:0,fontSize:13}}>Add</button>
                  </div>

                  {alSubjects.length > 0 && (
                    <>
                      <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid rgba(255,255,255,.06)',marginBottom:12}}>
                        <p style={{fontSize:11,color:'rgba(226,232,240,.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Grades for selected subjects</p>
                        <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                          {alSubjects.map(sub=>(
                            <div key={sub} style={{display:'flex',flexDirection:'column',gap:4,flex:'1 1 160px'}}>
                              <label style={{fontSize:11,color:'rgba(226,232,240,.45)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{sub}</label>
                              <select className="select-field" value={alResults[sub]||''} onChange={e=>setAlResults(p=>({...p,[sub]:e.target.value}))}>
                                <option value="">— Grade</option>{AL_GRADES.map(g=><option key={g} value={g}>{g}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="card fade-up" style={{animationDelay:'.06s'}}>
                  <p className="card-label">📝 O/L Results <span style={{fontWeight:400,textTransform:'none',letterSpacing:'normal',color:'rgba(226,232,240,.3)',fontSize:11}}>(optional)</span></p>
                  {Object.entries(olResults).length>0&&(
                    <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:14}}>
                      {Object.entries(olResults).map(([s,g])=>(
                        <div key={s} className="grade-badge">{s}: <strong style={{color:'#f59e0b'}}>{g}</strong>
                          <button onClick={()=>removeOl(s)} style={{background:'none',border:'none',color:'rgba(226,232,240,.4)',cursor:'pointer',padding:'0 0 0 4px',fontSize:14,lineHeight:1}}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{display:'flex',gap:8}}>
                    <select className="select-field" value={olSubject} onChange={e=>setOlSubject(e.target.value)} style={{flex:2}}>
                      <option value="">Select subject</option>{OL_SUBJECTS.filter(s=>!olResults[s]).map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="select-field" value={olGrade} onChange={e=>setOlGrade(e.target.value)} style={{flex:1}}>
                      <option value="">Grade</option>{OL_GRADES.map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                    <button onClick={addOlResult} style={{background:'#f59e0b',color:'#020817',border:'none',borderRadius:10,padding:'0 18px',fontWeight:700,cursor:'pointer',fontFamily:'Outfit,sans-serif',flexShrink:0}}>Add</button>
                  </div>
                </div>
                <button className="btn-primary" onClick={()=>setStep(2)} disabled={alSubjects.length===0}>Next: Skills →</button>
              </div>
            )}

            {step===2 && (
              <div>
                <div className="card fade-up">
                  <p className="card-label">⚡ Select Your Skills</p>
                  <div style={{display:'flex',flexWrap:'wrap'}}>
                    {SKILLS_LIST.map(s=><button key={s} className={`tag-btn${skills.includes(s)?' active':''}`} onClick={()=>toggleSkill(s)}>{s}</button>)}
                  </div>
                  {skills.length>0&&<p style={{fontSize:12,color:'#f59e0b',marginTop:12,fontWeight:600}}>{skills.length} selected</p>}
                </div>
                <div style={{display:'flex',gap:12}}>
                  <button className="btn-ghost" style={{flex:1}} onClick={()=>setStep(1)}>← Back</button>
                  <button className="btn-primary" style={{flex:2}} onClick={()=>setStep(3)}>Next: Interests →</button>
                </div>
              </div>
            )}

            {step===3 && (
              <div>
                <div className="card fade-up">
                  <p className="card-label">🎯 Select Your Interests</p>
                  <div style={{display:'flex',flexWrap:'wrap'}}>
                    {INTERESTS_LIST.map(i=><button key={i} className={`tag-btn${interests.includes(i)?' ai':''}`} onClick={()=>toggleInterest(i)}>{i}</button>)}
                  </div>
                  {interests.length>0&&<p style={{fontSize:12,color:'#a5b4fc',marginTop:12,fontWeight:600}}>{interests.length} selected</p>}
                </div>
                {saveErr&&<div style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,padding:'12px 16px',marginBottom:16,fontSize:13,color:'#fca5a5'}}>⚠️ {saveErr}</div>}
                <div style={{display:'flex',gap:12}}>
                  <button className="btn-ghost" style={{flex:1}} onClick={()=>setStep(2)}>← Back</button>
                  <button className="btn-primary" style={{flex:2}} onClick={saveProfile} disabled={saving||alSubjects.length===0}>
                    {saving?<><Spinner/>Saving…</>:'🎯 Save & See My Career Matches →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
