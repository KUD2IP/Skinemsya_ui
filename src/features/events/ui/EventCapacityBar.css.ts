import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const panel = style({
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
  color: 'inherit',
  font: 'inherit',
  border: 'none',
  transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
  selectors: {
    '&:active': { background: vars.color.bg.elevated },
  },
});

export const previewIcon = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  color: vars.color.green[400],
});

export const withInvite = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: vars.space[3],
  minWidth: 0,
});

export const panelGrow = style({
  flex: '1 1 auto',
  minWidth: 0,
});

export const inviteButton = style({
  flexShrink: 0,
  selectors: {
    '&&': {
      height: 'auto',
      minHeight: vars.size.controlMd,
      paddingInline: vars.space[4],
      fontSize: vars.fontSize.bodySm,
    },
  },
});

export const previewTitle = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.bodySm,
  fontWeight: 500,
  color: vars.color.text.primary,
});

export const previewMeta = style({
  flexShrink: 0,
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
  fontVariantNumeric: 'tabular-nums',
});
