import { keyframes, style } from '@vanilla-extract/css';
import { breakpoints, vars } from '@/shared/theme';

const routeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const shell = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
  margin: '0 auto',
  '@media': {
    [breakpoints.lg]: {
      maxWidth: vars.layout.contentMaxWidth,
      borderLeft: `1px solid ${vars.color.border.subtle}`,
      borderRight: `1px solid ${vars.color.border.subtle}`,
      boxShadow: vars.shadow.lg,
    },
  },
});

export const stackShell = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const routeViewport = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
});

export const routePage = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  overscrollBehavior: 'none',
  background: vars.color.bg.base,
  pointerEvents: 'auto',
  animationName: routeIn,
  animationDuration: vars.motion.durationFast,
  animationTimingFunction: vars.motion.easeStandard,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
});
