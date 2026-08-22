import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const row = style({
  height: vars.size.controlMd,
  borderRadius: vars.radius.md,
});

export const block = style({
  height: 120,
  borderRadius: vars.radius.lg,
});

export const description = style({
  fontSize: vars.fontSize.body,
  color: vars.color.text.secondary,
  lineHeight: vars.lineHeight.body,
  whiteSpace: 'pre-wrap',
});

export const meta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.muted,
});

export const participantRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.subtle}`,
});

export const participantHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[3],
  minWidth: 0,
  width: '100%',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  color: 'inherit',
  font: 'inherit',
});

export const caret = style({
  flexShrink: 0,
  color: vars.color.text.muted,
  marginTop: 2,
});

export const participantMain = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  flex: 1,
});

export const participantName = style({
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const participantAmount = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
});
