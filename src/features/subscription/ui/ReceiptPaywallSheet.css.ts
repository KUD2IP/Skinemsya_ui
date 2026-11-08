import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const price = style({
  fontSize: vars.fontSize.h2,
  lineHeight: vars.lineHeight.h2,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const note = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});

export const offerLink = style({
  color: vars.color.text.primary,
  fontWeight: 600,
});
