import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
});

export const progress = style({
  fontSize: vars.fontSize.body,
  fontWeight: 600,
});

export const progressMeta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
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

export const actionRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[2],
});

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
});
