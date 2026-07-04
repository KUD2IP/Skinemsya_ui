import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const tabShell = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  paddingBottom: `calc(${vars.space[12]} + ${vars.layout.safeBottom})`,
});

export const tabViewport = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
});

export const tabTrack = style({
  display: 'flex',
  height: '100%',
  width: '200%',
  transition: `transform ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
});

export const tabTrackReduced = style({
  transition: 'none',
});

export const tabPage = recipe({
  base: {
    flex: '0 0 50%',
    width: '50%',
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    background: vars.color.bg.base,
  },
  variants: {
    active: {
      true: {
        pointerEvents: 'auto',
      },
      false: {
        pointerEvents: 'none',
        userSelect: 'none',
      },
    },
  },
  defaultVariants: { active: true },
});
