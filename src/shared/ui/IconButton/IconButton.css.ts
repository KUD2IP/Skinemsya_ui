import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const iconButton = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: vars.radius.full,
    color: vars.color.text.primary,
    transition: `transform ${vars.motion.durationFast} ${vars.motion.easeStandard}, background-color ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
    selectors: {
      '&:active:not(:disabled)': { transform: 'scale(0.96)' },
      '&:focus-visible': { outline: 'none', boxShadow: `0 0 0 3px ${vars.color.focusRing}` },
      '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transitionProperty: 'background-color',
      },
    },
  },
  variants: {
    variant: {
      solid: { background: vars.color.bg.elevated },
      ghost: {
        background: 'transparent',
        '@media': {
          '(hover: hover)': {
            selectors: { '&:hover:not(:disabled)': { background: vars.color.bg.elevated } },
          },
        },
      },
      bare: {
        background: 'transparent',
        selectors: {
          '&:hover:not(:disabled)': { background: 'transparent' },
          '&:active:not(:disabled)': { background: 'transparent' },
        },
      },
    },
    size: {
      sm: { width: vars.size.controlSm, height: vars.size.controlSm },
      md: { width: vars.size.controlMd, height: vars.size.controlMd },
    },
  },
  defaultVariants: { variant: 'ghost', size: 'md' },
});

export type IconButtonVariants = NonNullable<RecipeVariants<typeof iconButton>>;
