import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const trigger = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[3],
    width: '100%',
    minHeight: vars.size.controlMd,
    padding: `${vars.space[3]} ${vars.space[4]}`,
    background: vars.color.bg.inset,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radius.md,
    color: vars.color.text.primary,
    textAlign: 'left',
    cursor: 'pointer',
    transition: `border-color ${vars.motion.durationFast} ${vars.motion.easeStandard}, box-shadow ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
    selectors: {
      '&:focus-visible': {
        outline: 'none',
        borderColor: vars.color.border.strong,
        boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    placeholder: {
      true: { color: vars.color.text.muted },
    },
  },
});

export const triggerBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const triggerLabel = style({
  fontSize: vars.fontSize.body,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const triggerHint = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.secondary,
});

export const chevron = style({
  flexShrink: 0,
  color: vars.color.text.muted,
});

export const searchWrap = style({
  marginBottom: vars.space[4],
});

export const optionsList = style({
  maxHeight: 'min(40dvh, 320px)',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
});

export const emptySearch = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
  padding: `${vars.space[4]} 0`,
  textAlign: 'center',
});
