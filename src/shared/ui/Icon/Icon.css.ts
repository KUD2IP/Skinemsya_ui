import { styleVariants } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const glyph = styleVariants({
  sm: {
    width: vars.size.iconSm,
    height: vars.size.iconSm,
    flexShrink: 0,
  },
  md: {
    width: vars.size.iconMd,
    height: vars.size.iconMd,
    flexShrink: 0,
  },
  lg: {
    width: vars.size.iconLg,
    height: vars.size.iconLg,
    flexShrink: 0,
  },
});
