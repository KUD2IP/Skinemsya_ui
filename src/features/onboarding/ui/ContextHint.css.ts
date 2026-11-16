import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const hint = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[3],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.default}`,
  background: vars.color.green[900],
  color: vars.color.text.secondary,
});

export const icon = style({
  flexShrink: 0,
  display: 'inline-flex',
  paddingTop: vars.space[1],
  color: vars.color.green[300],
});

export const text = style({
  flex: 1,
  minWidth: 0,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
});
