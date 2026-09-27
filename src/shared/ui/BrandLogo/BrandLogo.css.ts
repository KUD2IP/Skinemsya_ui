import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const root = recipe({
  base: {
    display: 'block',
    flexShrink: 0,
    overflow: 'hidden',
  },
  variants: {
    size: {
      xs: { width: vars.size.iconLg, height: vars.size.iconLg },
      sm: { width: vars.size.avatarLg, height: vars.size.avatarLg },
      md: { width: '96px', height: '96px' },
      lg: { width: '128px', height: '128px' },
    },
  },
  defaultVariants: { size: 'md' },
});

export const svg = recipe({
  base: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  variants: {
    size: {
      xs: { filter: 'none' },
      sm: { filter: `drop-shadow(0 0 16px ${vars.color.glow})` },
      md: { filter: `drop-shadow(0 0 24px ${vars.color.glow})` },
      lg: { filter: `drop-shadow(0 0 24px ${vars.color.glow})` },
    },
  },
  defaultVariants: { size: 'md' },
});
