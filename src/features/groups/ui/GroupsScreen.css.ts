import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const tabPad = style({
  paddingBottom: `calc(${vars.space[12]} + ${vars.layout.safeBottom})`,
});

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const row = style({
  height: vars.size.controlMd,
  borderRadius: vars.radius.md,
});

export const hero = style({
  height: 88,
  borderRadius: vars.radius.lg,
});

export const fabRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const sectionLabel = style({
  fontSize: vars.fontSize.bodySm,
  fontWeight: 500,
  color: vars.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

export const groupMeta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const actionsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
});

export const dangerZone = style({
  marginTop: vars.space[4],
});
