import { useState } from 'react';
import i18n from './index';

function useTranslation() {
  const [locale, setLocaleState] = useState(i18n.locale);

  const setLocale = (newLocale: string) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  };

  return {
    t: (key: string, options?: Record<string, any>) => i18n.t(key, options),
    locale,
    setLocale,
  };
}

export default useTranslation;
