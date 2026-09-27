import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/shared/lib';
import { landingReveal } from '../lib/landingMotion';

export interface LandingRevealProps {
  children: ReactNode;
  className?: string;
}

/** Обёртка с появлением блока при скролле (уважает prefers-reduced-motion). */
export function LandingReveal({ children, className }: LandingRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={landingReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8% 0px' }}
    >
      {children}
    </motion.div>
  );
}
