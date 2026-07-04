import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const row = style({
  height: vars.size.controlMd,
  borderRadius: vars.radius.md,
});

export const block = style({
  height: 120,
  borderRadius: vars.radius.lg,
});

export const description = style({
  fontSize: vars.fontSize.body,
  color: vars.color.text.secondary,
  lineHeight: vars.lineHeight.body,
  whiteSpace: 'pre-wrap',
});

export const meta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.muted,
});
