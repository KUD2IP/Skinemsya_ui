import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const card = style({
  display: 'grid',
  overflow: 'hidden',
  borderRadius: vars.radius['2xl'],
  border: `1px solid ${vars.color.border.default}`,
  background: vars.color.bg.surface,
  '@media': {
    [breakpoints.lg]: {
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
    },
  },
});

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[5],
  padding: vars.space[7],
  '@media': {
    [breakpoints.lg]: { padding: vars.space[10] },
  },
});

export const kicker = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: vars.color.text.secondary,
});

export const title = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingLg,
  lineHeight: vars.lineHeight.landingLg,
  fontWeight: 650,
  letterSpacing: '-0.035em',
  color: vars.color.text.primary,
});

export const text = style({
  maxWidth: '52ch',
  fontSize: vars.fontSize.bodyLg,
  lineHeight: 1.55,
  color: vars.color.text.secondary,
});

export const cta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  width: '100%',
  maxWidth: '340px',
  marginTop: vars.space[3],
});

export const hint = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.secondary,
});

export const option = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[4],
  padding: vars.space[7],
  borderTop: `1px dashed ${vars.color.border.default}`,
  background: vars.color.bg.inset,
  color: vars.color.text.primary,
  '@media': {
    [breakpoints.lg]: {
      justifyContent: 'center',
      padding: vars.space[10],
      borderTop: 'none',
      borderLeft: `1px dashed ${vars.color.border.default}`,
    },
  },
});

export const optionLabel = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: vars.color.text.secondary,
});

export const optionTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingMd,
  lineHeight: vars.lineHeight.landingMd,
  fontWeight: 650,
  letterSpacing: '-0.025em',
});

export const price = style({
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.display,
  lineHeight: vars.lineHeight.display,
  fontWeight: 700,
  letterSpacing: '-0.04em',
  color: vars.color.green[300],
});

export const pricePeriod = style({
  fontFamily: vars.font.sans,
  fontSize: vars.fontSize.body,
  fontWeight: 500,
  letterSpacing: 'normal',
  color: vars.color.text.secondary,
});

export const optionText = style({
  maxWidth: '42ch',
  fontSize: vars.fontSize.body,
  lineHeight: 1.6,
  color: vars.color.text.secondary,
});
