import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[8],
  marginTop: vars.space[10],
  paddingTop: vars.space[10],
  paddingBottom: vars.space[6],
  borderTop: `1px solid ${vars.color.border.subtle}`,
});

const columns = {
  display: 'grid',
  gap: vars.space[8],
  '@media': {
    [breakpoints.lg]: {
      alignItems: 'start',
      columnGap: vars.space[10],
    },
  },
} as const;

export const grid = style({
  ...columns,
  '@media': {
    [breakpoints.lg]: {
      ...columns['@media'][breakpoints.lg],
      gridTemplateColumns: 'minmax(0, 1.4fr) minmax(160px, 0.8fr) minmax(180px, 1fr)',
    },
  },
});

export const gridShort = style({
  ...columns,
  '@media': {
    [breakpoints.lg]: {
      ...columns['@media'][breakpoints.lg],
      gridTemplateColumns: 'minmax(0, 1.4fr) minmax(160px, 0.8fr)',
    },
  },
});

export const brandCol = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[4],
  maxWidth: '36ch',
});

export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[3],
  minHeight: vars.size.controlMd,
  color: vars.color.text.primary,
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
      borderRadius: vars.radius.sm,
    },
  },
});

export const brandName = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 700,
  letterSpacing: '-0.03em',
});

export const brandText = style({
  fontSize: vars.fontSize.body,
  lineHeight: 1.55,
  color: vars.color.text.secondary,
});

export const col = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[1],
});

export const colTitle = style({
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const link = style({
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: vars.size.controlMd,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 500,
  color: vars.color.text.secondary,
  textDecoration: 'none',
  borderRadius: vars.radius.sm,
  transition: `color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: {
    '&:hover': { color: vars.color.text.primary },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
    },
  },
});

export const linkLabel = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});

export const linkValue = style({
  color: vars.color.text.secondary,
});

export const legal = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[4],
  paddingTop: vars.space[5],
  borderTop: `1px solid ${vars.color.border.subtle}`,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});

export const legalLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: vars.size.controlMd,
  color: vars.color.text.muted,
  textDecoration: 'none',
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
