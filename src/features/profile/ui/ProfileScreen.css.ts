import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const heroRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[5],
});

export const heroName = style({
  fontSize: vars.fontSize.h2,
  lineHeight: vars.lineHeight.h2,
  fontWeight: 700,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const heroMeta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const sectionLabel = style({
  fontSize: vars.fontSize.caption,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: vars.color.text.muted,
  paddingInline: vars.space[2],
});

export const valueMono = style({
  fontFamily: vars.font.mono,
  color: vars.color.text.primary,
});

export const muted = style({
  color: vars.color.text.muted,
});

export const settingsHint = style({
  margin: 0,
  paddingInline: vars.space[2],
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.muted,
});

export const settingsHintLink = style({
  padding: 0,
  border: 'none',
  background: 'none',
  font: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  color: vars.color.text.link,
  cursor: 'pointer',
  textDecoration: 'underline',
});

export const sheetText = style({
  margin: 0,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});

export const sheetList = style({
  margin: 0,
  paddingLeft: vars.space[5],
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});

export const inlineEditor = style({
  padding: vars.space[4],
  borderTop: `1px solid ${vars.color.border.subtle}`,
});
