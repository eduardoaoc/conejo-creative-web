import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { navItems } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="max-w-sm">
            <p className="text-lg font-bold tracking-tight text-zinc-950">
              Conejo<span className="text-brand-600">Creative</span>
            </p>
            <p className="mt-2 text-sm font-medium text-brand-700">{t('slogan')}</p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">{t('description')}</p>
          </div>

          <nav aria-label={t('navTitle')} className="sm:justify-self-end">
            <h2 className="text-sm font-semibold text-zinc-950">{t('navTitle')}</h2>
            <ul className="mt-4 space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          © {year} {siteConfig.name}. {t('rights')}
        </p>
      </Container>
    </footer>
  );
}
