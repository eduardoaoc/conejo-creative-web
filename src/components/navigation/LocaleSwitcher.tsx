'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('localeSwitcher');
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (nextLocale: Locale) => {
    startTransition(() => {
      // `pathname` no incluye el prefijo de idioma, así que la ruta actual se conserva.
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{t('label')}</span>
      <select
        value={locale}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value as Locale)}
        className="h-10 rounded-md border border-zinc-300 bg-white px-2 text-sm font-medium text-zinc-700"
      >
        {routing.locales.map((availableLocale) => (
          <option key={availableLocale} value={availableLocale}>
            {t(availableLocale)}
          </option>
        ))}
      </select>
    </label>
  );
}
