import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[#1e3a2a] text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
      data-testid="language-toggle"
      title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      <span className={language === 'en' ? 'font-semibold text-[#50C878]' : 'text-slate-500'}>EN</span>
      <span className="text-slate-600">|</span>
      <span className={language === 'hi' ? 'font-semibold text-[#50C878]' : 'text-slate-500'}>हिं</span>
    </button>
  );
};

export default LanguageToggle;
