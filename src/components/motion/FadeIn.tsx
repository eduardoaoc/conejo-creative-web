'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// Entrada suave con fade + desplazamiento vertical, basada en Motion.
// Si el usuario prefiere movimiento reducido, el contenido se muestra sin animar.
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
