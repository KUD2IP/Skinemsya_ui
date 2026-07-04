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
