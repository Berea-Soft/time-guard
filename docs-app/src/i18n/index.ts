import { ref, type Ref, type InjectionKey } from 'vue';
import es from './locale/es.json';
import en from './locale/en.json';

export type Locale = 'es' | 'en';

export interface I18nContext {
  locale: Ref<Locale>;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (l: Locale) => void;
}

export const I18N_KEY: InjectionKey<I18nContext> = Symbol('i18n');

const translations: Record<string, Record<string, string>> = { es, en };

export function createI18n(): I18nContext {
  const saved =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('tg-locale') as Locale | null)
      : null;
  const locale = ref<Locale>(saved || 'es');

  function t(key: string, params?: Record<string, string | number>): string {
    let text = translations[locale.value]?.[key];
    if (text === undefined) {
      // Fallback: try Spanish, then return the key
      text = translations['es']?.[key] ?? key;
    }
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
    return text;
  }

  function setLocale(l: Locale) {
    locale.value = l;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tg-locale', l);
    }
  }

  return { locale, t, setLocale };
}
