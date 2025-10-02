import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './locales/en';
import vi from './locales/vi';

const translations = { en, vi };

const i18n = new I18n(translations);
i18n.enableFallback = true;
const deviceLocale = (Localization.getLocales && typeof Localization.getLocales === 'function')
	? Localization.getLocales()[0]?.languageTag
	: 'en';
i18n.locale = deviceLocale || 'en';

export default i18n;
