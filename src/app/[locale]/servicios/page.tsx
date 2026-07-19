import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageTitle } from '@/components/ui/PageTitle';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { createPageMetadata } from '@/lib/metadata';

const serviceKeys = [
  'web',
  'sites',
  'software',
  'automation',
  'integrations',
  'systems',
  'ai',
  'transformation',
] as const;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, namespace: 'meta.services', path: '/servicios' });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');

  return (
    <Section>
      <Container>
        <PageTitle title={t('title')} description={t('description')} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key) => (
            <li
              key={key}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-brand-300"
            >
              <h2 className="text-lg font-semibold text-zinc-950">{t(`items.${key}.title`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {t(`items.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
