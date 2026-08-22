import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.subtle}`,
});

export const plain = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
});

export const title = style({
  fontSize: vars.fontSize.body,
  fontWeight: 600,
});

export const row = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[3],
});

export const name = style({
  fontSize: vars.fontSize.body,
  color: vars.color.text.primary,
});

export const meta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const amount = style({
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
});
