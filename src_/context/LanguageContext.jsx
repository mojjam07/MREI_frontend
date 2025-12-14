


import React, { createContext, useEffect, useMemo } from 'react';
import translations from '../i18n/translations.js';
import { DEFAULT_LANGUAGE, LANGUAGE_DIRECTIONS } from '../utils/constants.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = React.useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    document.documentElement.dir = LANGUAGE_DIRECTIONS[language] || LANGUAGE_DIRECTIONS.EN;
  }, [language]);

  const t = useMemo(() => {
    return (key) => {
      const keys = key.split('.');
      let value = translations[language];
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    };
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
