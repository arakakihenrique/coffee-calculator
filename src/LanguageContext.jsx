import { createContext, useContext, useState } from 'react';
import { TRANSLATIONS } from './i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  function t(key) {
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
