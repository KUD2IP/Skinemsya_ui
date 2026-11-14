import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const head = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[3],
  '@media': {
    [breakpoints.md]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: vars.space[4],
    },
  },
});

export const kicker = style({
  order: 2,
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.secondary,
});

export const title = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingLg,
  lineHeight: vars.lineHeight.landingLg,
  fontWeight: 650,
  letterSpacing: '-0.035em',
  color: vars.color.text.primary,
  flexShrink: 0,
});

export const root = style({
  borderTop: `1px solid ${vars.color.border.default}`,
});

export const item = style({
  borderBottom: `1px solid ${vars.color.border.default}`,
});

export const trigger = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[5],
  width: '100%',
  minHeight: vars.size.controlLg,
  paddingBlock: vars.space[5],
  paddingInline: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.text.primary,
  fontFamily: vars.font.sans,
  fontSize: vars.fontSize.bodyLg,
  lineHeight: vars.lineHeight.bodyLg,
  fontWeight: 600,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `inset 0 0 0 3px ${vars.color.focusRing}`,
    },
  },
});

export const indicator = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: vars.size.controlSm,
  height: vars.size.controlSm,
  borderRadius: vars.radius.full,
  color: vars.color.text.secondary,
  background: vars.color.bg.surface,
  transition: `transform ${vars.motion.durationBase} ${vars.motion.easeStandard}, color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: {
    '&[data-state=open]': {
      transform: 'rotate(45deg)',
      color: vars.color.accent,
    },
  },
});

export const content = style({
  overflow: 'hidden',
});

export const answer = style({
  maxWidth: '62ch',
  paddingBottom: vars.space[6],
  paddingRight: vars.space[10],
  fontSize: vars.fontSize.body,
  lineHeight: 1.6,
  color: vars.color.text.secondary,
});
