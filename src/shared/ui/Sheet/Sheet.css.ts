import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { breakpoints, vars } from '@/shared/theme';

export const backdrop = recipe({
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: Number(vars.z.overlay),
    background: vars.color.bg.overlay,
    pointerEvents: 'auto',
  },
  variants: {
    layer: {
      base: {},
      nested: { zIndex: Number(vars.z.modal) + 40 },
    },
  },
  defaultVariants: { layer: 'base' },
});

export const positioner = recipe({
  base: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: Number(vars.z.modal),
  },
  variants: {
    layer: {
      base: {},
      nested: { zIndex: Number(vars.z.modal) + 50 },
    },
  },
  defaultVariants: { layer: 'base' },
});

export const positionerKeyboard = style({
  transition: 'top 0.28s cubic-bezier(0.32, 0.72, 0, 1), height 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
});

export const content = style({
  width: '100%',
  maxWidth: vars.layout.contentMaxWidth,
  maxHeight: 'min(92dvh, calc(var(--tg-viewport-stable-height, 100dvh) - 24px))',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: vars.color.bg.elevated,
  borderTopLeftRadius: vars.radius['2xl'],
  borderTopRightRadius: vars.radius['2xl'],
  boxShadow: vars.shadow.lg,
  pointerEvents: 'auto',
  touchAction: 'pan-y',
  transition: 'max-height 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
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

export const contentAnimating = style({
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
});

export const grabberRow = style({
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: `${vars.space[3]} ${vars.space[6]} 0`,
  cursor: 'grab',
  touchAction: 'none',
  userSelect: 'none',
  selectors: {
    '&:active': { cursor: 'grabbing' },
  },
});

export const grabber = style({
  width: '40px',
  height: '4px',
  borderRadius: vars.radius.full,
  background: vars.color.border.strong,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[2],
  flexShrink: 0,
  textAlign: 'left',
  padding: `${vars.space[4]} ${vars.space[6]} ${vars.space[5]}`,
  '@media': {
    [`screen and (max-width: 359px)`]: {
      padding: `${vars.space[4]} ${vars.space[5]} ${vars.space[5]}`,
    },
  },
});

export const body = style({
  flex: 1,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  scrollPaddingBottom: 'calc(var(--sheet-keyboard-inset, 0px) + 24px)',
  padding: `0 ${vars.space[6]} calc(${vars.space[7]} + ${vars.layout.safeBottom} + var(--sheet-keyboard-inset, 0px))`,
  '@media': {
    [`screen and (max-width: 359px)`]: {
      padding: `0 ${vars.space[5]} calc(${vars.space[6]} + ${vars.layout.safeBottom} + var(--sheet-keyboard-inset, 0px))`,
    },
  },
});

export const titleText = style({
  fontSize: vars.fontSize.h2,
  lineHeight: vars.lineHeight.h2,
  fontWeight: 600,
  color: vars.color.text.primary,
  textAlign: 'left',
  width: '100%',
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
