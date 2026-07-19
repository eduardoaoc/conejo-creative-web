import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary';

// La microinteracción del botón se resuelve solo con CSS (ver docs/ANIMATIONS.md):
// las transiciones de hover/active no justifican JavaScript.
const baseClasses =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-500',
  secondary: 'border border-zinc-300 text-zinc-900 hover:border-zinc-500',
};

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export function ButtonLink({ href, children, variant = 'primary', className }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </Link>
  );
}
