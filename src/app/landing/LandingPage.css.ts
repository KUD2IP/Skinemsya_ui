import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const shell = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
});

export const root = style({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  maxWidth: '100%',
  background: `radial-gradient(ellipse 90% 45% at 50% -8%, color-mix(in srgb, ${vars.color.accent} 5%, transparent), transparent 55%), ${vars.color.bg.base}`,
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarGutter: 'stable both-edges',
  WebkitOverflowScrolling: 'touch',
  scrollBehavior: 'smooth',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      scrollBehavior: 'auto',
    },
  },
});

export const inner = style({
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: vars.layout.landingMaxWidth,
  minWidth: 0,
  marginInline: 'auto',
  paddingInline: vars.space[5],
  paddingBottom: vars.layout.safeBottom,
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    [breakpoints.lg]: {
      paddingInline: vars.space[8],
    },
    [breakpoints.xl]: {
      maxWidth: vars.layout.landingMaxWidthWide,
    },
  },
});
