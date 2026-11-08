import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[3],
  maxWidth: '62ch',
  padding: vars.space[6],
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.subtle}`,
  background: vars.color.bg.elevated,
});

export const kicker = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
});

export const title = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingMd,
  lineHeight: vars.lineHeight.landingMd,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
});

export const price = style({
  fontSize: vars.fontSize.h1,
  lineHeight: vars.lineHeight.h1,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const text = style({
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});

export const seller = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.primary,
});

export const link = style({
  color: vars.color.text.primary,
  fontWeight: 600,
  textDecoration: 'none',
  selectors: {
    '&:hover': { color: vars.color.green[300] },
  },
});
