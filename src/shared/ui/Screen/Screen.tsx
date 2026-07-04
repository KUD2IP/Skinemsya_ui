import type { ReactNode } from 'react';
import { RefreshBar } from '@/shared/ui/RefreshBar';
import * as css from './Screen.css';

export interface ScreenProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  headerLeading?: ReactNode;
  headerAction?: ReactNode;
  /** Фоновое обновление данных — полоска в верхней safe-area. */
  refreshing?: boolean;
  children: ReactNode;
}

/** Адаптивный контейнер экрана: safe-area, центрирование и ограничение ширины. */
export function Screen({
  title,
  subtitle,
  headerLeading,
  headerAction,
  refreshing = false,
  children,
}: ScreenProps) {
  const showHeader =
    title != null || subtitle != null || headerLeading != null || headerAction != null;

  return (
    <div className={css.screen}>
      <RefreshBar active={refreshing} />
      <div className={css.glow} aria-hidden />
      <div className={css.container}>
        {showHeader ? (
          <header className={css.header}>
            {headerLeading != null ? (
              <div className={css.headerLeading}>{headerLeading}</div>
            ) : null}
            {title != null || subtitle != null ? (
              <div className={css.headerMain}>
                {title != null ? <h1 className={css.headerTitle}>{title}</h1> : null}
                {subtitle != null ? <p className={css.headerSubtitle}>{subtitle}</p> : null}
              </div>
            ) : null}
            {headerAction != null ? (
              <div className={css.headerAction}>{headerAction}</div>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </div>
  );
}
