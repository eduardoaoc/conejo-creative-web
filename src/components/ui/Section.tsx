import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-24', className)}>
      {children}
    </section>
  );
}
