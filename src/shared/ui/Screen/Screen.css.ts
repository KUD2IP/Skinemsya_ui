import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from '@/shared/theme';

export const screen = style({
  position: 'relative',
  flex: '1 0 auto',
  width: '100%',
  minHeight: vars.layout.appHeight,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

export const glow = style({
  position: 'absolute',
  inset: 0,
  height: 'min(220px, 32vh)',
  backgroundImage: vars.gradient.glowSpot,
  pointerEvents: 'none',
});

export const container = style({
  position: 'relative',
  width: '100%',
  maxWidth: vars.layout.contentMaxWidth,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  padding: `calc(${vars.layout.safeTop} + ${vars.space[5]}) ${vars.space[5]} ${vars.space[6]}`,
  '@media': {
    [`screen and (max-width: 359px)`]: {
      gap: vars.space[5],
      padding: `calc(${vars.layout.safeTop} + ${vars.space[4]}) ${vars.space[4]} ${vars.space[5]}`,
    },
    [breakpoints.md]: {
      padding: `calc(${vars.layout.safeTop} + ${vars.space[6]}) ${vars.space[6]} ${vars.space[7]}`,
    },
  },
});

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[3],
  minHeight: vars.size.controlMd,
  minWidth: 0,
});

export const headerLeading = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',
  marginLeft: `calc(${vars.space[2]} * -1)`,
});

export const headerMain = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  alignSelf: 'center',
});

export const headerAction = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',
  marginLeft: 'auto',
});

export const headerTitle = style({
  minWidth: 0,
  fontSize: vars.fontSize.h1,
  lineHeight: vars.lineHeight.h1,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@media': {
    [`screen and (max-width: 359px)`]: {
      fontSize: vars.fontSize.h2,
      lineHeight: vars.lineHeight.h2,
    },
  },
});

export const headerSubtitle = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
