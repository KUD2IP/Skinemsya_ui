import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const button = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[3],
    fontFamily: vars.font.sans,
    fontWeight: 600,
    fontSize: vars.fontSize.button,
    lineHeight: vars.lineHeight.button,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    borderRadius: vars.radius.lg,
    border: '1px solid transparent',
    transition: `transform ${vars.motion.durationFast} ${vars.motion.easeSpring}, background ${vars.motion.durationBase} ${vars.motion.easeStandard}, box-shadow ${vars.motion.durationBase} ${vars.motion.easeStandard}, opacity ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
    selectors: {
      '&:active:not(:disabled)': { transform: 'scale(0.97)' },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
      },
      '&:disabled': { opacity: 0.45, cursor: 'not-allowed', boxShadow: 'none' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transitionProperty: 'background, box-shadow, opacity',
      },
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundImage: vars.gradient.brand,
        color: vars.color.text.inverse,
        boxShadow: vars.shadow.glow,
        '@media': {
          '(hover: hover)': {
            selectors: { '&:hover:not(:disabled)': { filter: 'brightness(1.05)' } },
          },
        },
      },
      secondary: {
        background: vars.color.bg.elevated,
        color: vars.color.text.primary,
        borderColor: vars.color.border.default,
        '@media': {
          '(hover: hover)': {
            selectors: { '&:hover:not(:disabled)': { borderColor: vars.color.border.strong } },
          },
        },
      },
      ghost: {
        background: 'transparent',
        color: vars.color.text.primary,
        '@media': {
          '(hover: hover)': {
            selectors: { '&:hover:not(:disabled)': { background: vars.color.bg.elevated } },
          },
        },
      },
      tonal: {
        background: vars.color.green[900],
        color: vars.color.green[300],
      },
      danger: {
        background: vars.color.dangerBg,
        color: vars.color.danger,
        borderColor: vars.color.danger,
      },
      link: {
        background: 'transparent',
        color: vars.color.text.link,
        paddingInline: '0',
        height: 'auto',
      },
    },
    size: {
      sm: { height: vars.size.controlSm, paddingInline: vars.space[5], borderRadius: vars.radius.md, fontSize: vars.fontSize.bodySm },
      md: { height: vars.size.controlMd, paddingInline: vars.space[6] },
      lg: { height: vars.size.controlLg, paddingInline: vars.space[7] },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
