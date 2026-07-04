import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: vars.space[4],
  padding: `${vars.space[9]} ${vars.space[6]}`,
});

export const iconWrap = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '72px',
  height: '72px',
  borderRadius: vars.radius.full,
  background: vars.color.green[900],
  color: vars.color.green[300],
  marginBottom: vars.space[2],
});

export const title = style({
  fontSize: vars.fontSize.h3,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const description = style({
  fontSize: vars.fontSize.body,
  color: vars.color.text.secondary,
  maxWidth: '320px',
});

export const actions = style({
  marginTop: vars.space[3],
  display: 'flex',
  gap: vars.space[3],
});
