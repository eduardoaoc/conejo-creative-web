import { env } from '@/config/env';
import type { Locale } from '@/types';

export const siteConfig = {
  name: 'ConejoCreative',
  url: env.NEXT_PUBLIC_SITE_URL,
} as const;

// Etiquetas BCP 47 para `<html lang>`, hreflang y Open Graph.
// El portugués del sitio es específicamente el de Brasil.
export const localeLangTags: Record<Locale, string> = {
  es: 'es',
  pt: 'pt-BR',
  en: 'en',
};

export const openGraphLocales: Record<Locale, string> = {
  es: 'es_ES',
  pt: 'pt_BR',
  en: 'en_US',
};
