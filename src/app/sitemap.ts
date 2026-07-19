import type { MetadataRoute } from 'next';
import { alternateLanguages, localizedUrl } from '@/lib/metadata';
import { routing } from '@/i18n/routing';

const paths = ['', '/servicios', '/proyectos', '/nosotros', '/contacto'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: {
        languages: alternateLanguages(path),
      },
    })),
  );
}
