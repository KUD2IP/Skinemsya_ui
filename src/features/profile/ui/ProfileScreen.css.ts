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
