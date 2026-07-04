import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const field = style({
  width: '100%',
  height: vars.size.controlMd,
  padding: `0 ${vars.space[5]}`,
  background: vars.color.bg.inset,
  color: vars.color.text.primary,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.body,
  transition: `border-color ${vars.motion.durationBase} ${vars.motion.easeStandard}, box-shadow ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: {
    '&::placeholder': { color: vars.color.text.muted },
    '&:focus': {
      outline: 'none',
      borderColor: vars.color.border.strong,
      boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
    },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

export const textarea = style([
  field,
  {
    height: 'auto',
    minHeight: '96px',
    padding: vars.space[5],
    resize: 'vertical',
    lineHeight: vars.lineHeight.body,
  },
]);

export const invalid = style({
  borderColor: vars.color.danger,
  selectors: {
    '&:focus': {
      borderColor: vars.color.danger,
      boxShadow: `0 0 0 3px ${vars.color.dangerBg}`,
    },
  },
});

export const noSpinners = style({
  selectors: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&[type="number"]': {
      MozAppearance: 'textfield',
    },
  },
});

export const mono = style({
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
});
