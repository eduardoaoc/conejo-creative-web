import { useTranslations } from 'next-intl';
import { navItems } from '@/config/navigation';
import { Link } from '@/i18n/navigation';

export function DesktopNav() {
  const t = useTranslations('nav');

  return (
    <nav aria-label={t('main')} className="hidden md:block">
      <ul className="flex items-center gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              {t(item.key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
