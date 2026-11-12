import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const bootOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 10_000,
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'none',
});

export const bootApp = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  height: '100%',
  width: '100%',
  overflow: 'hidden',
});

/** После появления приложения снимаем transform, чтобы каретка в полях не съезжала. */
export const bootAppSettled = style({
  transform: 'none !important',
  translate: 'none !important',
});

/** Лендинг: один скролл внутри страницы, шапка всегда снаружи скролла. */
export const bootLanding = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  height: vars.layout.appHeight,
  minHeight: vars.layout.appHeight,
  overflow: 'hidden',
});
