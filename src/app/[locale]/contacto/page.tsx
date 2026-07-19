import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageTitle } from '@/components/ui/PageTitle';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { createPageMetadata } from '@/lib/metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, namespace: 'meta.contact', path: '/contacto' });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');

  return (
    <Section>
      <Container>
        <PageTitle title={t('title')} description={t('description')} />
        <div className="mt-12 max-w-2xl">
          <ContactForm />
          <p className="mt-6 text-sm text-zinc-500">{t('responseNote')}</p>
        </div>
      </Container>
    </Section>
  );
}
