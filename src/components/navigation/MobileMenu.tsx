'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { navItems } from '@/config/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('nav');

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md"
      >
        <span className="sr-only">{open ? t('closeMenu') : t('openMenu')}</span>
        <span
          aria-hidden="true"
          className={cn(
            'h-0.5 w-5 bg-zinc-900 transition-transform motion-reduce:transition-none',
            open && 'translate-y-2 rotate-45',
          )}
        />
        <span
          aria-hidden="true"
          className={cn('h-0.5 w-5 bg-zinc-900 transition-opacity', open && 'opacity-0')}
        />
        <span
          aria-hidden="true"
          className={cn(
            'h-0.5 w-5 bg-zinc-900 transition-transform motion-reduce:transition-none',
            open && '-translate-y-2 -rotate-45',
          )}
        />
      </button>

      <nav
        id={panelId}
        aria-label={t('main')}
        className={cn(
          'absolute inset-x-0 top-full border-b border-zinc-200 bg-white shadow-lg',
          !open && 'hidden',
        )}
      >
        <ul className="space-y-1 px-4 py-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
