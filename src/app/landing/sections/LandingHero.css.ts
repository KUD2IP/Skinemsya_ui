import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const hero = style({
  position: 'relative',
  paddingTop: vars.space[7],
  '@media': {
    [breakpoints.lg]: { paddingTop: vars.space[9] },
  },
});

export const grid = style({
  display: 'grid',
  gap: vars.space[10],
  alignItems: 'center',
  width: '100%',
  '@media': {
    [breakpoints.xl]: {
      gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
      gap: vars.space[8],
    },
    [breakpoints.wide]: {
      gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
      gap: vars.space[9],
    },
  },
});

export const copy = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[6],
  maxWidth: vars.layout.landingHeroCopyMax,
  position: 'relative',
});

export const stamp = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space[3],
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.secondary,
});

export const stampDot = style({
  width: vars.space[3],
  height: vars.space[3],
  borderRadius: vars.radius.full,
  background: vars.color.accent,
  flexShrink: 0,
});

export const title = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingXl,
  lineHeight: vars.lineHeight.landingXl,
  fontWeight: 650,
  letterSpacing: '-0.045em',
  color: vars.color.text.primary,
  textWrap: 'balance',
});

export const titleLine = style({
  display: 'block',
});

export const titleAccent = style({
  display: 'block',
  color: vars.color.accent,
});

export const subtitle = style({
  fontSize: vars.fontSize.bodyLg,
  lineHeight: 1.55,
  color: vars.color.text.secondary,
  maxWidth: '48ch',
});

export const ctaBlock = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[3],
  width: '100%',
  maxWidth: '360px',
});

export const trust = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.secondary,
});

export const scrollHint = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  minHeight: vars.size.controlMd,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  textDecoration: 'none',
  transition: `color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: {
    '&:hover': { color: vars.color.text.primary },
    '&:focus-visible': {
      outline: 'none',
      color: vars.color.text.primary,
      boxShadow: `0 0 0 3px ${vars.color.focusRing}`,
      borderRadius: vars.radius.sm,
    },
  },
});

export const visual = style({
  position: 'relative',
  minWidth: 0,
  width: '100%',
});

export const board = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  minWidth: 0,
  '@media': {
    [breakpoints.wide]: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.08fr) minmax(220px, 0.92fr)',
      alignItems: 'end',
      paddingBottom: vars.space[10],
    },
  },
});

export const receipt = style({
  position: 'relative',
  width: `calc(100% - ${vars.space[6]})`,
  maxWidth: '420px',
  transform: 'rotate(-1.5deg)',
  transformOrigin: 'center',
  filter: `drop-shadow(0 20px 28px color-mix(in srgb, ${vars.color.bg.base} 80%, transparent))`,
  '@media': {
    [breakpoints.lg]: {
      width: '100%',
      marginInline: 'auto',
    },
    [breakpoints.wide]: {
      width: '100%',
      maxWidth: 'none',
      marginInline: 0,
      transform: 'rotate(-2deg)',
    },
  },
});

export const settlement = style({
  position: 'relative',
  zIndex: 1,
  width: `calc(100% - ${vars.space[7]})`,
  marginTop: `calc(${vars.space[6]} * -1)`,
  marginLeft: 'auto',
  padding: vars.space[5],
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.default}`,
  background: vars.color.bg.elevated,
  boxShadow: vars.shadow.lg,
  '@media': {
    [breakpoints.lg]: {
      maxWidth: '360px',
      marginRight: vars.space[4],
    },
    [breakpoints.wide]: {
      width: '100%',
      maxWidth: 'none',
      marginTop: 0,
      marginRight: 0,
      marginLeft: `calc(${vars.space[7]} * -1)`,
      marginBottom: vars.space[7],
    },
  },
});

export const settlementHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  paddingBottom: vars.space[4],
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

export const shares = style({
  display: 'flex',
  flexDirection: 'column',
});

export const share = style({
  display: 'grid',
  gridTemplateColumns: `${vars.space[7]} minmax(0, 1fr) auto`,
  alignItems: 'center',
  gap: vars.space[3],
  paddingBlock: vars.space[4],
  borderTop: `1px solid ${vars.color.border.subtle}`,
});

export const shareIndex = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
});

export const shareName = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const payerNote = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  fontWeight: 400,
  color: vars.color.text.secondary,
});

export const shareAmount = style({
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.primary,
  whiteSpace: 'nowrap',
});

export const settlementTotal = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: vars.space[3],
  marginTop: vars.space[2],
  padding: vars.space[4],
  borderRadius: vars.radius.md,
  background: vars.color.green[900],
  color: vars.color.green[200],
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  fontWeight: 600,
});

export const settlementCheck = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
});

export const caption = style({
  marginTop: vars.space[5],
  maxWidth: '46ch',
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.caption,
  lineHeight: 1.55,
  color: vars.color.text.secondary,
  '@media': {
    [breakpoints.wide]: {
      position: 'absolute',
      left: 0,
      bottom: 0,
    },
  },
});
