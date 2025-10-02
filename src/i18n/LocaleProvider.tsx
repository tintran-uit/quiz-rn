import React, { createContext, useContext, useState, useMemo } from 'react';
import i18n from './index';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: typeof i18n.t;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: i18n.locale,
  setLocale: () => {},
  t: i18n.t.bind(i18n),
});

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState(i18n.locale);

  const setLocale = (newLocale: string) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  };

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: i18n.t.bind(i18n),
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);
