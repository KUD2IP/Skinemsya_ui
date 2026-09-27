import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const root = style({
  position: 'relative',
  flexShrink: 0,
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  scrollbarGutter: 'stable both-edges',
  paddingTop: vars.layout.safeTop,
  background: vars.color.bg.base,
  borderBottom: `1px solid ${vars.color.border.subtle}`,
  boxShadow: `0 8px 24px color-mix(in srgb, ${vars.color.bg.base} 55%, transparent)`,
  transition: `border-color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
});

export const inner = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: vars.layout.landingMaxWidth,
  minWidth: 0,
  marginInline: 'auto',
  minHeight: vars.size.controlLg,
  paddingInline: vars.space[5],
  paddingBlock: vars.space[3],
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: vars.space[3],
  '@media': {
    [breakpoints.sm]: {
      paddingBlock: vars.space[4],
      gap: vars.space[4],
    },
    [breakpoints.lg]: {
      gridTemplateColumns: 'auto 1fr auto',
      paddingInline: vars.space[8],
      gap: vars.space[6],
    },
    [breakpoints.xl]: {
      maxWidth: vars.layout.landingMaxWidthWide,
    },
  },
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
  color: vars.color.text.primary,
  textDecoration: 'none',
  '@media': {
    [breakpoints.sm]: { gap: vars.space[3] },
  },
});

export const wordmark = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.bodyLg,
  lineHeight: vars.lineHeight.bodyLg,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@media': {
    [breakpoints.md]: {
      fontSize: vars.fontSize.h3,
      lineHeight: vars.lineHeight.h3,
    },
  },
});

export const nav = style({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[5],
  '@media': {
    [breakpoints.lg]: {
      display: 'flex',
    },
  },
});

export const navLink = style({
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 500,
  color: vars.color.text.secondary,
  textDecoration: 'none',
  minHeight: vars.size.controlLg,
  display: 'inline-flex',
  alignItems: 'center',
  transition: `color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: {
    '&:hover': { color: vars.color.text.primary },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
      borderRadius: vars.radius.sm,
    },
  },
});

export const ctaCol = style({
  display: 'flex',
  justifyContent: 'flex-end',
  minWidth: 0,
  maxWidth: '100%',
});

export const ctaWide = style({
  display: 'none',
  width: '100%',
  maxWidth: '220px',
  '@media': {
    [breakpoints.md]: { display: 'flex' },
  },
});

export const ctaNarrow = style({
  display: 'flex',
  width: '100%',
  maxWidth: '132px',
  '@media': {
    [breakpoints.md]: { display: 'none' },
  },
});
