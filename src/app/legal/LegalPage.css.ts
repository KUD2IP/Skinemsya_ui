import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const top = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[4],
  minHeight: vars.size.controlLg,
  paddingInline: vars.space[5],
});

export const back = style({
  color: vars.color.text.secondary,
  textDecoration: 'none',
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  selectors: {
    '&:hover': { color: vars.color.text.primary },
  },
});

export const article = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  padding: vars.space[5],
  paddingBottom: vars.space[10],
  maxWidth: '68ch',
});

export const title = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingLg,
  lineHeight: vars.lineHeight.landingLg,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
});

export const lead = style({
  fontSize: vars.fontSize.bodyLg,
  lineHeight: vars.lineHeight.bodyLg,
  color: vars.color.text.secondary,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.h3,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const text = style({
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});

export const price = style({
  fontSize: vars.fontSize.h1,
  lineHeight: vars.lineHeight.h1,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const requisites = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[5],
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.subtle}`,
  background: vars.color.bg.elevated,
});

export const requisiteLabel = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

export const requisiteValue = style({
  fontSize: vars.fontSize.bodyLg,
  lineHeight: vars.lineHeight.bodyLg,
  fontWeight: 600,
  color: vars.color.text.primary,
});

globalStyle(`${requisiteValue} a`, {
  color: 'inherit',
  textDecoration: 'underline',
  textUnderlineOffset: '0.15em',
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  margin: 0,
  paddingLeft: vars.space[5],
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});
