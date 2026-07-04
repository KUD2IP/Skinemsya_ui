import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { breakpoints, vars } from '@/shared/theme';

export const bar = recipe({
  base: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: vars.z.sticky,
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: vars.layout.safeBottom,
    paddingTop: vars.space[3],
    paddingLeft: vars.space[4],
    paddingRight: vars.space[4],
    background: `linear-gradient(180deg, transparent 0%, ${vars.color.bg.base} 40%)`,
    pointerEvents: 'none',
    transition: `opacity ${vars.motion.durationBase} ${vars.motion.easeStandard}, transform ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
    '@media': {
      [breakpoints.lg]: {
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
        width: vars.layout.contentMaxWidth,
        paddingLeft: vars.space[5],
        paddingRight: vars.space[5],
      },
    },
  },
  variants: {
    hidden: {
      true: {
        opacity: 0,
        transform: 'translateY(110%)',
        pointerEvents: 'none',
      },
      false: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  defaultVariants: { hidden: false },
  compoundVariants: [
    {
      variants: { hidden: false },
      style: {
        '@media': {
          [breakpoints.lg]: {
            transform: 'translateX(-50%) translateY(0)',
          },
        },
      },
    },
    {
      variants: { hidden: true },
      style: {
        '@media': {
          [breakpoints.lg]: {
            transform: 'translateX(-50%) translateY(110%)',
          },
        },
      },
    },
  ],
});

export const inner = style({
  position: 'relative',
  pointerEvents: 'auto',
  display: 'flex',
  width: '100%',
  maxWidth: vars.layout.contentMaxWidth,
  gap: vars.space[2],
  padding: vars.space[2],
  background: vars.color.bg.surface,
  border: `1px solid ${vars.color.border.subtle}`,
  borderRadius: vars.radius.xl,
  boxShadow: vars.shadow.lg,
  vars: {
    '--tab-gap': vars.space[2],
  },
});

export const tabLink = style({
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  minHeight: vars.size.controlMd,
  borderRadius: vars.radius.lg,
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
    },
  },
});

export const tabIndicator = style({
  position: 'absolute',
  top: vars.space[2],
  bottom: vars.space[2],
  left: vars.space[2],
  width: `calc((100% - ${vars.space[2]} * 3) / 2)`,
  borderRadius: vars.radius.lg,
  background: vars.color.green[900],
  boxShadow: `inset 0 0 0 1px ${vars.color.border.subtle}`,
  pointerEvents: 'none',
  transition: `transform ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
});

export const tabContent = recipe({
  base: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[1],
    padding: `${vars.space[1]} ${vars.space[2]}`,
    color: vars.color.text.muted,
    fontSize: vars.fontSize.caption,
    transition: `color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  },
  variants: {
    active: {
      true: {
        color: vars.color.green[300],
      },
    },
  },
});

export const tabIcon = recipe({
  base: {
    display: 'flex',
    transition: `transform ${vars.motion.durationFast} ${vars.motion.easeStandard}, opacity ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  },
  variants: {
    active: {
      true: {
        transform: 'scale(1.08) translateY(-1px)',
      },
      false: {
        transform: 'scale(1) translateY(0)',
      },
    },
  },
  defaultVariants: { active: false },
});

export const tabLabel = recipe({
  base: {
    transition: `opacity ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  },
  variants: {
    active: {
      true: { opacity: 1 },
      false: { opacity: 0.72 },
    },
  },
  defaultVariants: { active: false },
});
