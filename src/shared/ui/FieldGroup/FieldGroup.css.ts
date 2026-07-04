import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const label = style({
  fontSize: vars.fontSize.bodySm,
  fontWeight: 500,
  color: vars.color.text.secondary,
});

export const hint = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.muted,
});

export const error = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.danger,
});
