import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const tour = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  paddingBottom: vars.space[6],
});

export const progress = style({
  display: 'flex',
  gap: vars.space[2],
});

export const progressButton = style({
  flex: 1,
  minWidth: 0,
  height: vars.size.controlMd,
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.focusRing}`,
      outlineOffset: vars.space[1],
      borderRadius: vars.radius.sm,
    },
  },
});

export const progressSegment = recipe({
  base: {
    width: '100%',
    height: vars.space[1],
    borderRadius: vars.radius.full,
    transition: `background ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  },
  variants: {
    active: {
      true: { background: vars.color.accent },
      false: { background: vars.color.border.default },
    },
  },
});

export const eyebrow = style({
  display: 'block',
  marginBottom: vars.space[2],
  color: vars.color.green[300],
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  fontWeight: 600,
});

export const stepTitle = style({
  marginBottom: vars.space[2],
  color: vars.color.text.primary,
  fontSize: vars.fontSize.h2,
  lineHeight: vars.lineHeight.h2,
  letterSpacing: '-0.01em',
});

export const stepDescription = style({
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
});

export const stage = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
});

export const tapZone = style({
  position: 'absolute',
  zIndex: 1,
  top: 0,
  bottom: 0,
  margin: 0,
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  touchAction: 'pan-y',
  selectors: {
    '&:disabled': { cursor: 'default' },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.focusRing}`,
      outlineOffset: `calc(${vars.space[1]} * -1)`,
    },
  },
});

export const tapBack = style({
  left: 0,
  width: '30%',
});

export const tapForward = style({
  right: 0,
  width: '70%',
});
