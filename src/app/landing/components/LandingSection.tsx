import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import * as css from './LandingSection.css';

export interface LandingSectionProps {
  id?: string;
  band?: boolean;
  className?: string;
  children: ReactNode;
}

/** Каркас секции лендинга: вертикальный ритм и опциональная подложка-полоса. */
export function LandingSection({ id, band = false, className, children }: LandingSectionProps) {
  return (
    <section id={id} className={cx(css.root, band && css.band, className)}>
      {children}
    </section>
  );
}
