import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageTitle } from '@/components/ui/PageTitle';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { createPageMetadata } from '@/lib/metadata';

const processKeys = ['discovery', 'build', 'launch'] as const;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, namespace: 'meta.projects', path: '/proyectos' });
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  return (
    <Section>
      <Container>
        <PageTitle title={t('title')} description={t('description')} />

        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8">
          <h2 className="text-lg font-semibold text-zinc-950">{t('comingSoon.title')}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            {t('comingSoon.description')}
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{t('process.title')}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {processKeys.map((key, index) => (
              <li key={key} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <span className="text-sm font-semibold text-brand-600">0{index + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-zinc-950">
                  {t(`process.steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {t(`process.steps.${key}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16">
          <ButtonLink href="/contacto">{t('cta')}</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
