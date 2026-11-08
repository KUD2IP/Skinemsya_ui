import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.subtle}`,
});

export const text = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  flex: 1,
});

export const name = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  fontWeight: 700,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const meta = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.secondary,
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  flexShrink: 0,
});

export const pager = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
});

export const pagerLabel = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
});
