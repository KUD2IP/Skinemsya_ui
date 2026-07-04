import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const row = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: vars.space[3],
  width: '100%',
});

export const countryButton = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  height: vars.size.controlMd,
  padding: `0 ${vars.space[4]}`,
  background: vars.color.bg.inset,
  color: vars.color.text.primary,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.bodySm,
  fontFamily: vars.font.mono,
  cursor: 'pointer',
  transition: `border-color ${vars.motion.durationBase} ${vars.motion.easeStandard}, box-shadow ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: {
    '&:focus-visible': {
      outline: 'none',
      borderColor: vars.color.border.strong,
      boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
    },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

export const countryButtonInvalid = style({
  borderColor: vars.color.danger,
});

export const flag = style({
  fontSize: '20px',
  lineHeight: 1,
});

export const nationalInput = style({
  flex: 1,
  minWidth: 0,
});

export const search = style({
  marginBottom: vars.space[4],
});

export const countryList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  maxHeight: '50dvh',
  overflowY: 'auto',
});

export const countryOption = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  textAlign: 'left',
  color: vars.color.text.primary,
  background: 'transparent',
  transition: `background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
  selectors: {
    '&:hover': { background: vars.color.bg.elevated },
    '&[data-selected="true"]': {
      background: vars.color.green[900],
      color: vars.color.green[300],
    },
  },
});

export const countryName = style({
  flex: 1,
  fontSize: vars.fontSize.body,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const countryDial = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
  selectors: {
    [`${countryOption}[data-selected="true"] &`]: { color: 'inherit', opacity: 0.85 },
  },
});
