import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { breakpoints, vars } from '@/shared/theme';

export const screen = style({
  position: 'relative',
  flex: '1 1 auto',
  width: '100%',
  minHeight: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  overflow: 'hidden',
});

export const glow = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 'min(560px, 70vh)',
  backgroundImage: vars.gradient.glowWash,
  pointerEvents: 'none',
});

export const frame = style({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  width: '100%',
  maxWidth: vars.layout.contentMaxWidth,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[3],
  flexShrink: 0,
  minHeight: vars.size.controlMd,
  minWidth: 0,
  padding: `calc(${vars.layout.safeTop} + ${vars.space[5]}) ${vars.space[5]} ${vars.space[6]}`,
  '@media': {
    [`screen and (max-width: 359px)`]: {
      padding: `calc(${vars.layout.safeTop} + ${vars.space[4]}) ${vars.space[4]} ${vars.space[5]}`,
    },
    [breakpoints.md]: {
      padding: `calc(${vars.layout.safeTop} + ${vars.space[6]}) ${vars.space[6]} ${vars.space[6]}`,
    },
  },
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

export const body = recipe({
  base: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    minHeight: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    touchAction: 'pan-y',
    scrollPaddingTop: vars.space[3],
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[6],
    padding: `${vars.space[6]} ${vars.space[5]} calc(${vars.space[6]} + var(--keyboard-inset, 0px))`,
    '@media': {
      [`screen and (max-width: 359px)`]: {
        gap: vars.space[5],
        padding: `${vars.space[6]} ${vars.space[4]} calc(${vars.space[5]} + var(--keyboard-inset, 0px))`,
      },
      [breakpoints.md]: {
        padding: `${vars.space[6]} ${vars.space[6]} calc(${vars.space[7]} + var(--keyboard-inset, 0px))`,
      },
    },
  },
  variants: {
    insetTop: {
      true: {
        paddingTop: `calc(${vars.layout.safeTop} + ${vars.space[5]})`,
      },
    },
  },
});
