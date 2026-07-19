import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'pt', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  // Sin detección por Accept-Language ni cookie: `/` redirige SIEMPRE a `/es`.
  // El idioma se elige de forma explícita con el selector.
  localeDetection: false,
});
