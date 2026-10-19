import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const lockedNote = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.secondary,
});
