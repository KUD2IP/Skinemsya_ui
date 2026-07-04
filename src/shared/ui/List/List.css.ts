import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const list = style({
  background: vars.color.bg.surface,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.subtle}`,
  overflow: 'hidden',
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  width: '100%',
  textAlign: 'left',
  padding: `${vars.space[4]} ${vars.space[5]}`,
  minHeight: vars.size.controlLg,
  color: vars.color.text.primary,
  background: 'transparent',
  transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}, transform ${vars.motion.durationFast} ${vars.motion.easeSpring}`,
  selectors: {
    '&:not(:last-child)': {
      boxShadow: `inset 0 -1px 0 ${vars.color.border.subtle}`,
    },
  },
});

export const itemInteractive = style({
  cursor: 'pointer',
  selectors: {
    '&:active': { transform: 'scale(0.99)', background: vars.color.bg.elevated },
    '&:focus-visible': { outline: 'none', background: vars.color.bg.elevated },
  },
  '@media': {
    '(hover: hover)': {
      selectors: { '&:hover': { background: vars.color.bg.elevated } },
    },
  },
});

export const leading = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  color: vars.color.green[400],
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  flex: 1,
});

export const title = style({
  fontSize: vars.fontSize.body,
  fontWeight: 500,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const subtitle = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const trailing = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  color: vars.color.text.secondary,
});
