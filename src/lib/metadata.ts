import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { localeLangTags, openGraphLocales, siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/types';

export function localizedUrl(locale: Locale, path: string): string {
  return `${siteConfig.url}/${locale}${path}`;
}

export function alternateLanguages(path: string): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [localeLangTags[locale], localizedUrl(locale, path)]),
  );

  return {
    ...languages,
    'x-default': localizedUrl(routing.defaultLocale, path),
  };
}

type PageMetadataParams = {
  locale: string;
  namespace: string;
  path: string;
};

export async function createPageMetadata({
  locale: requestedLocale,
  namespace,
  path,
}: PageMetadataParams): Promise<Metadata> {
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const t = await getTranslations({ locale, namespace });
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: alternateLanguages(path),
    },
    openGraph: {
      title,
      description,
      url: localizedUrl(locale, path),
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}
