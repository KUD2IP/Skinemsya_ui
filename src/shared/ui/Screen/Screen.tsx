import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
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

/** Высота пилюли: вертикальные поля space.2 и строка bodySm, плюс рамка. */
const TOAST_HEIGHT = 28;

function placeToast(header: HTMLElement) {
  const body = header.nextElementSibling;
  const headerPad = parseFloat(getComputedStyle(header).paddingBottom) || 0;
  const bodyPad = body instanceof HTMLElement ? parseFloat(getComputedStyle(body).paddingTop) || 0 : 0;
  const lane = headerPad + bodyPad;
  const top = header.getBoundingClientRect().bottom - headerPad + Math.max(0, (lane - TOAST_HEIGHT) / 2);
  document.documentElement.style.setProperty('--app-toast-top', `${Math.round(top)}px`);
}

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
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) {
      document.documentElement.style.removeProperty('--app-toast-top');
      return;
    }
    const place = () => placeToast(header);
    place();
    const observer = new ResizeObserver(place);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--app-toast-top');
    };
  }, [showHeader, title, subtitle]);

  return (
    <div className={css.screen}>
      <RefreshBar active={refreshing} />
      <div className={css.glow} aria-hidden />
      <div className={css.frame}>
        {showHeader ? (
          <header ref={headerRef} className={css.header}>
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
        <div className={css.body({ insetTop: !showHeader })}>{children}</div>
      </div>
    </div>
  );
}
