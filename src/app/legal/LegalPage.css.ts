import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const article = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  maxWidth: '68ch',
});

export const lead = style({
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});

export const updated = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
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

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  margin: 0,
  paddingLeft: vars.space[5],
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
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

globalStyle(`${text} a, ${list} a, ${requisiteValue} a`, {
  color: vars.color.text.link,
  textDecoration: 'underline',
  textUnderlineOffset: '0.15em',
});
