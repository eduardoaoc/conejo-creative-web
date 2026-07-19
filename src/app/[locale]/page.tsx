import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { createPageMetadata } from '@/lib/metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, namespace: 'meta.home', path: '' });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServicesPreview />
    </>
  );
}
