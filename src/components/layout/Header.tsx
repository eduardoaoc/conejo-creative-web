import { LocaleSwitcher } from '@/components/navigation/LocaleSwitcher';
import { DesktopNav } from '@/components/navigation/DesktopNav';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { Link } from '@/i18n/navigation';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-950">
          Conejo<span className="text-brand-600">Creative</span>
          <span className="sr-only"> — {siteConfig.name}</span>
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
