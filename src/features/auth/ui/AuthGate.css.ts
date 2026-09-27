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
  minHeight: vars.layout.appHeight,
  width: '100%',
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
