import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

/** Фиксированная полоска в верхней safe-area — отдельно от контента экрана. */
export const root = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: vars.z.header,
  paddingTop: vars.layout.safeTop,
  paddingLeft: vars.space[5],
  paddingRight: vars.space[5],
  pointerEvents: 'none',
});

export const track = style({
  position: 'relative',
  height: '3px',
  borderRadius: vars.radius.full,
  background: vars.color.bg.inset,
  overflow: 'hidden',
  boxShadow: vars.shadow.inset,
});

export const beam = style({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '36%',
  background: vars.gradient.brand,
  borderRadius: vars.radius.full,
  boxShadow: vars.shadow.glowSoft,
});
