import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const listPanel = style({
  display: 'flex',
  flexDirection: 'column',
  background: vars.color.bg.surface,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.subtle}`,
  overflow: 'hidden',
});

export const option = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[3],
    width: '100%',
    minHeight: vars.size.controlMd,
    padding: `${vars.space[3]} ${vars.space[4]}`,
    paddingLeft: vars.space[5],
    borderRadius: vars.radius.lg,
    border: `1px solid ${vars.color.border.subtle}`,
    background: vars.color.bg.surface,
    color: vars.color.text.primary,
    textAlign: 'left',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: `border-color ${vars.motion.durationFast} ${vars.motion.easeStandard}, background ${vars.motion.durationFast} ${vars.motion.easeStandard}, transform ${vars.motion.durationFast} ${vars.motion.easeSpring}`,
    selectors: {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: vars.space[2],
        bottom: vars.space[2],
        width: '2px',
        borderRadius: vars.radius.full,
        background: 'transparent',
        transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },
  },
  variants: {
    selected: {
      true: {
        borderColor: vars.color.border.default,
        background: vars.color.bg.elevated,
        selectors: {
          '&::before': {
            background: vars.color.green[500],
          },
        },
      },
    },
  },
});

export const listOption = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    minHeight: vars.size.controlMd,
    padding: `${vars.space[3]} ${vars.space[4]}`,
    paddingLeft: vars.space[5],
    background: 'transparent',
    color: vars.color.text.primary,
    textAlign: 'left',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
    selectors: {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: vars.space[2],
        bottom: vars.space[2],
        width: '2px',
        borderRadius: vars.radius.full,
        background: 'transparent',
        transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
      },
      '&:not(:last-child)': {
        boxShadow: `inset 0 -1px 0 ${vars.color.border.subtle}`,
      },
      '&:focus-visible': {
        outline: 'none',
        background: vars.color.bg.elevated,
        boxShadow: `inset 0 0 0 2px ${vars.color.focusRing}`,
      },
      '&:active': {
        background: vars.color.bg.elevated,
      },
    },
  },
  variants: {
    selected: {
      true: {
        background: vars.color.bg.elevated,
        selectors: {
          '&::before': {
            background: vars.color.green[500],
          },
        },
      },
    },
  },
});

export const optionLabel = style({
  flex: 1,
  minWidth: 0,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 500,
});

export const optionHint = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.secondary,
});

export const listOptionBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const listOptionHint = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});
