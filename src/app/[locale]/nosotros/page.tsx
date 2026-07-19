import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageTitle } from '@/components/ui/PageTitle';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { createPageMetadata } from '@/lib/metadata';

const valueKeys = ['closeness', 'quality', 'transparency'] as const;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, namespace: 'meta.about', path: '/nosotros' });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');

  return (
    <Section>
      <Container>
        <PageTitle title={t('title')} description={t('description')} />

        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{t('mission.title')}</h2>
          <p className="mt-4 leading-relaxed text-zinc-600">{t('mission.description')}</p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{t('values.title')}</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {valueKeys.map((key) => (
              <li key={key} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-zinc-950">
                  {t(`values.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {t(`values.items.${key}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
