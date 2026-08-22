import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const stepper = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  width: '100%',
  height: vars.size.controlMd,
  padding: `0 ${vars.space[2]}`,
  background: vars.color.bg.inset,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
});

export const invalid = style({
  borderColor: vars.color.danger,
});

export const btn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.text.primary,
  fontSize: '1.35rem',
  lineHeight: 1,
  cursor: 'pointer',
  flexShrink: 0,
  selectors: {
    '&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
  },
});

export const input = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  border: 'none',
  background: 'transparent',
  color: vars.color.text.primary,
  textAlign: 'center',
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  selectors: {
    '&::placeholder': { color: vars.color.text.muted, fontWeight: 400 },
    '&:focus': { outline: 'none' },
  },
});
