'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// GSAP solo se importa desde Client Components: nunca debe llegar al servidor.
gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Revela con stagger los descendientes marcados con `data-reveal`
 * cuando el contenedor entra en el viewport.
 *
 * Ejemplo canónico de GSAP + ScrollTrigger en el proyecto:
 * `gsap.context` limita los selectores al contenedor y `ctx.revert()`
 * limpia tweens y triggers al desmontar.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
