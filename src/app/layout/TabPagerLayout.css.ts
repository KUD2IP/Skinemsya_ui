import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const tabShell = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  position: 'relative',
  isolation: 'isolate',
  paddingBottom: `calc(${vars.space[12]} + ${vars.layout.safeBottom})`,
});

export const tabViewport = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
});

export const tabTrack = style({
  position: 'relative',
  height: '100%',
  width: '100%',
});

export const tabPage = recipe({
  base: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
    overscrollBehavior: 'none',
    background: vars.color.bg.base,
    transition: `opacity ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    active: {
      true: {
        opacity: 1,
        pointerEvents: 'auto',
        zIndex: 1,
      },
      false: {
        opacity: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      },
    },
  },
  defaultVariants: { active: true },
});
