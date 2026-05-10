import { createContext, useContext, useState } from 'react';
import en from '../i18n/en';
import si from '../i18n/si';
import ta from '../i18n/ta';

const DICTS = { en, si, ta };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('careerai_lang') || 'en');

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('careerai_lang', l);
  };

  // t('key') → translated string
  const t = (key) => DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Reusable language switcher widget
export function LangSwitcher({ style = {} }) {
  const { lang, switchLang } = useLanguage();
  const LANGS = [
    { code: 'en', label: 'EN' },
    { code: 'si', label: 'සිං' },
    { code: 'ta', label: 'தமிழ்' },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '3px', border: '1px solid rgba(255,255,255,0.1)', ...style }}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLang(code)}
          style={{
            background: lang === code ? '#f59e0b' : 'transparent',
            color:      lang === code ? '#020817' : 'rgba(226,232,240,0.6)',
            border: 'none', borderRadius: 6, padding: '4px 10px',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
            letterSpacing: lang === code ? '0.04em' : 0,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
