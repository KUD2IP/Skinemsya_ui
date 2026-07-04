import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

/** Единая поверхность списка — без glow на каждой строке. */
export const listPanel = style({
  background: vars.color.bg.surface,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.subtle}`,
  overflow: 'hidden',
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  gap: vars.space[4],
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[5]}`,
  minHeight: vars.size.controlLg,
  textAlign: 'left',
  background: 'transparent',
  cursor: 'pointer',
  transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
  selectors: {
    '&:not(:last-child)': {
      boxShadow: `inset 0 -1px 0 ${vars.color.border.subtle}`,
    },
    '&:active': { background: vars.color.bg.elevated },
    '&:focus-visible': {
      outline: 'none',
      background: vars.color.bg.elevated,
      boxShadow: `inset 0 0 0 2px ${vars.color.focusRing}`,
    },
  },
});

export const iconLeading = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  color: vars.color.green[400],
});

export const rowBody = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[3],
  minWidth: 0,
});

export const nameBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  flex: 1,
});

export const title = style({
  fontSize: vars.fontSize.body,
  fontWeight: 500,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const subtitle = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});

export const time = style({
  flexShrink: 0,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
  whiteSpace: 'nowrap',
  paddingTop: vars.space[1],
});

export const createRow = style({
  marginBottom: vars.space[1],
});

export const searchWrap = style({
  marginBottom: vars.space[1],
});

export const countLabel = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
  padding: `0 ${vars.space[1]} ${vars.space[2]}`,
});

export const panelSkeleton = style({
  height: 192,
  borderRadius: vars.radius.xl,
});
