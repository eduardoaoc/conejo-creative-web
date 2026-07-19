import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <Section className="bg-gradient-to-b from-brand-50 to-white">
      <Container>
        <FadeIn className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">{t('description')}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/contacto">{t('primaryCta')}</ButtonLink>
            <ButtonLink href="/servicios" variant="secondary">
              {t('secondaryCta')}
            </ButtonLink>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
