import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const createRow = style({
  marginBottom: vars.space[1],
});

export const searchWrap = style({
  marginBottom: vars.space[1],
  paddingTop: vars.space[2],
});

export const countLabel = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
  padding: `0 ${vars.space[1]} ${vars.space[2]}`,
});

export const emptyActions = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const listSkeleton = style({
  paddingTop: vars.space[2],
});
