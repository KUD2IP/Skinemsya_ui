import { CaretLeft } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { LandingIcon } from './LandingIcon';
import * as css from './LandingDemo.css';

export interface LandingDemoFrameProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Шапка как у `Screen`, но компактнее под мокап телефона. */
export function LandingDemoFrame({ title, subtitle, children }: LandingDemoFrameProps) {
  return (
    <div className={css.frame}>
      <header className={css.demoHeader}>
        <span className={css.demoHeaderLeading} aria-hidden>
          <LandingIcon icon={CaretLeft} size="sm" weight="bold" />
        </span>
        <div className={css.demoHeaderMain}>
          <h1 className={css.demoHeaderTitle}>{title}</h1>
          <p className={css.demoHeaderSubtitle}>{subtitle}</p>
        </div>
      </header>
      {children}
    </div>
  );
}
