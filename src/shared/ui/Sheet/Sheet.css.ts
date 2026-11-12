import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { breakpoints, vars } from '@/shared/theme';

/** В покое панель без transform. Кадры сдвига живут только пока идёт анимация. */
export const sheetIn = keyframes({
  from: { transform: 'translate3d(0, 100%, 0)' },
  to: { transform: 'none' },
});

export const sheetOut = keyframes({
  from: { transform: 'none' },
  to: { transform: 'translate3d(0, 100%, 0)' },
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const motionSafe = {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transform: 'none',
      opacity: 1,
    },
  },
} as const;

const sheetMax = `calc(100dvh - ${vars.layout.safeTop} - ${vars.space[4]} - var(--keyboard-inset, 0px))`;
const bodyMax = `calc(100dvh - ${vars.layout.safeTop} - 132px - var(--keyboard-inset, 0px))`;

/** Слой на весь экран. Сдвиг только в анимации: если она не стартовала, панель уже на месте. */
export const root = recipe({
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: vars.z.modal,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  variants: {
    layer: {
      base: {},
      nested: { zIndex: `calc(${vars.z.modal} + 50)` },
    },
  },
  defaultVariants: { layer: 'base' },
});

export const backdrop = style({
  position: 'absolute',
  inset: 0,
  background: vars.color.bg.overlay,
  opacity: 1,
  pointerEvents: 'auto',
  border: 'none',
  padding: 0,
});

export const backdropEnter = style({
  animationName: fadeIn,
  animationDuration: vars.motion.durationFast,
  animationTimingFunction: vars.motion.easeStandard,
  animationFillMode: 'none',
  ...motionSafe,
});

export const panel = style({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: vars.layout.contentMaxWidth,
  maxHeight: sheetMax,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: vars.color.bg.elevated,
  color: vars.color.text.primary,
  borderTopLeftRadius: vars.radius['2xl'],
  borderTopRightRadius: vars.radius['2xl'],
  boxShadow: vars.shadow.lg,
  pointerEvents: 'auto',
  touchAction: 'pan-y',
  opacity: 1,
  transform: 'none',
  '@media': {
    [`screen and (max-width: 359px)`]: {
      borderTopLeftRadius: vars.radius.xl,
      borderTopRightRadius: vars.radius.xl,
    },
    [breakpoints.lg]: {
      borderTopLeftRadius: vars.radius['2xl'],
      borderTopRightRadius: vars.radius['2xl'],
    },
  },
});

export const panelEnter = style({
  animationName: sheetIn,
  animationDuration: vars.motion.durationBase,
  animationTimingFunction: vars.motion.easeStandard,
  animationFillMode: 'none',
  ...motionSafe,
});

export const panelExit = style({
  animationName: sheetOut,
  animationDuration: vars.motion.durationFast,
  animationTimingFunction: vars.motion.easeIn,
  animationFillMode: 'forwards',
  ...motionSafe,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[2],
  flex: '0 0 auto',
  textAlign: 'left',
  padding: `${vars.space[4]} ${vars.space[4]} ${vars.space[5]} ${vars.space[6]}`,
  '@media': {
    [`screen and (max-width: 359px)`]: {
      padding: `${vars.space[4]} ${vars.space[3]} ${vars.space[5]} ${vars.space[5]}`,
    },
  },
});

export const headerTop = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[3],
  width: '100%',
});

export const titleSpacer = style({
  flex: 1,
});

export const body = style({
  flex: '0 0 auto',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  touchAction: 'pan-y',
  WebkitOverflowScrolling: 'touch',
  maxHeight: bodyMax,
  scrollPaddingTop: vars.space[3],
  scrollPaddingBottom: '24px',
  padding: `${vars.space[2]} ${vars.space[6]} calc(${vars.space[7]} + ${vars.layout.safeBottom} + var(--keyboard-inset, 0px))`,
  '@media': {
    [`screen and (max-width: 359px)`]: {
      padding: `${vars.space[2]} ${vars.space[5]} calc(${vars.space[6]} + ${vars.layout.safeBottom} + var(--keyboard-inset, 0px))`,
    },
  },
});

export const titleText = style({
  fontSize: vars.fontSize.h2,
  lineHeight: vars.lineHeight.h2,
  fontWeight: 600,
  color: vars.color.text.primary,
  textAlign: 'left',
  flex: 1,
  minWidth: 0,
  paddingTop: vars.space[1],
  '@media': {
    [`screen and (max-width: 359px)`]: {
      fontSize: vars.fontSize.h3,
      lineHeight: vars.lineHeight.h3,
    },
  },
});

export const descriptionText = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
  textAlign: 'left',
  width: '100%',
});
