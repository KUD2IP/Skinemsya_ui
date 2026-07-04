import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const sectionLabel = style({
  fontSize: vars.fontSize.bodySm,
  fontWeight: 500,
  color: vars.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

export const listSkeleton = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const listRow = style({
  height: vars.size.controlMd,
  borderRadius: vars.radius.md,
});
