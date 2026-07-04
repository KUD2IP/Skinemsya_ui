import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from '@/shared/theme';

export const shell = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  minHeight: vars.layout.appHeight,
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
  overflowX: 'hidden',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  background: vars.color.bg.base,
  pointerEvents: 'auto',
});
