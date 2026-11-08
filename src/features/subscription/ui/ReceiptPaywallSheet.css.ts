import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const price = style({
  fontSize: vars.fontSize.h2,
  lineHeight: vars.lineHeight.h2,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const note = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.secondary,
});

export const offerLink = style({
  color: vars.color.text.primary,
  fontWeight: 600,
});

export const sberLink = style({
  alignSelf: 'center',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.text.secondary,
  font: 'inherit',
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.body,
  fontWeight: 600,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      cursor: 'default',
      opacity: 0.6,
    },
  },
});

export const widget = style({
  minHeight: 480,
  overflow: 'hidden',
  borderRadius: vars.radius.lg,
  background: '#FFFFFF',
});
