import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const mark = style({
  display: 'block',
  width: vars.space[8],
  height: vars.space[8],
  flexShrink: 0,
});
