import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const listPanel = style({
  background: vars.color.bg.surface,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.subtle}`,
  overflow: 'hidden',
});

export const previewRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  minHeight: vars.size.controlMd,
  textAlign: 'left',
  background: 'transparent',
  cursor: 'pointer',
  transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
  selectors: {
    '&:active': { background: vars.color.bg.elevated },
    '&:focus-visible': {
      outline: 'none',
      background: vars.color.bg.elevated,
      boxShadow: `inset 0 0 0 2px ${vars.color.focusRing}`,
    },
  },
});

export const previewIcon = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  color: vars.color.green[400],
});

export const previewTitle = style({
  flex: 1,
  minWidth: 0,
  fontSize: vars.fontSize.bodySm,
  fontWeight: 500,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const memberRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[5]}`,
  minHeight: vars.size.controlLg,
  selectors: {
    '&:not(:last-child)': {
      boxShadow: `inset 0 -1px 0 ${vars.color.border.subtle}`,
    },
  },
});

export const memberBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const memberName = style({
  fontSize: vars.fontSize.body,
  fontWeight: 500,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const memberUsername = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
});

export const rolePill = style({
  flexShrink: 0,
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
});

export const membersList = style({
  background: vars.color.bg.surface,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.subtle}`,
  overflow: 'hidden',
});

export const rowSkeleton = style({
  height: 48,
});

export const chatHint = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
  lineHeight: vars.lineHeight.bodySm,
});
