import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const thumbnailButton = style({
  display: 'block',
  width: '100%',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
});

export const thumbnail = style({
  display: 'block',
  width: '100%',
  maxHeight: 160,
  objectFit: 'cover',
  borderRadius: vars.radius.lg,
});

export const fullImage = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: vars.radius.md,
});

export const error = style({
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.bodySm,
});
