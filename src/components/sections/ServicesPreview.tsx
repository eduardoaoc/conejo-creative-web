import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

const previewKeys = ['web', 'software', 'automation', 'ai'] as const;

export function ServicesPreview() {
  const t = useTranslations('home.services');

  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950">{t('title')}</h2>
          <p className="mt-4 leading-relaxed text-zinc-600">{t('description')}</p>
        </div>

        <ScrollReveal className="mt-12">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {previewKeys.map((key) => (
              <li
                key={key}
                data-reveal
                className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-brand-300"
              >
                <h3 className="text-lg font-semibold text-zinc-950">{t(`items.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {t(`items.${key}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <div className="mt-12">
          <ButtonLink href="/servicios" variant="secondary">
            {t('cta')}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
