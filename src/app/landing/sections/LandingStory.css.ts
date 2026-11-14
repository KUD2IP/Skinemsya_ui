import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const intro = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
});

export const kicker = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

export const introTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingLg,
  lineHeight: vars.lineHeight.landingLg,
  fontWeight: 650,
  letterSpacing: '-0.035em',
  color: vars.color.text.primary,
  maxWidth: '24ch',
});

export const introText = style({
  maxWidth: '48ch',
  fontSize: vars.fontSize.bodyLg,
  lineHeight: 1.55,
  color: vars.color.text.secondary,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignItems: 'start',
  '@media': {
    [breakpoints.xl]: {
      gridTemplateColumns: `minmax(0, 1fr) ${vars.layout.landingStoryCol}`,
      columnGap: vars.space[10],
    },
  },
});

const mobile = 'screen and (max-width: 767px)';

export const beats = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[10],
  minWidth: 0,
  '@media': {
    [breakpoints.xl]: { gap: 0, paddingBottom: '12vh' },
  },
});

export const rail = style({
  display: 'none',
  '@media': {
    [breakpoints.lg]: {
      display: 'block',
      position: 'absolute',
      left: `calc(${vars.space[8]} / 2)`,
      top: vars.space[5],
      bottom: vars.space[10],
      width: '1px',
      background: vars.color.border.subtle,
    },
  },
});

export const railFill = style({
  position: 'absolute',
  inset: 0,
  background: vars.color.accent,
  transformOrigin: 'top center',
});

export const beat = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: `${vars.space[12]} minmax(0, 1fr)`,
  columnGap: vars.space[5],
  alignItems: 'start',
  paddingTop: vars.space[6],
  borderTop: `1px solid ${vars.color.border.subtle}`,
  transition: `opacity ${vars.motion.durationSlow} ${vars.motion.easeStandard}`,
  '@media': {
    [mobile]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
      gap: vars.space[4],
    },
    [breakpoints.xl]: {
      minHeight: '52vh',
      alignContent: 'center',
      columnGap: vars.space[7],
      paddingTop: 0,
      borderTop: 'none',
    },
  },
});

export const beatTime = style({
  position: 'relative',
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 500,
  color: vars.color.text.secondary,
  whiteSpace: 'nowrap',
  paddingLeft: vars.space[7],
  '@media': {
    [mobile]: {
      paddingLeft: 0,
      fontSize: vars.fontSize.caption,
      lineHeight: vars.lineHeight.caption,
    },
  },
});

export const beatDot = style({
  display: 'none',
  '@media': {
    [breakpoints.lg]: {
      display: 'block',
      position: 'absolute',
      left: `calc(${vars.space[8]} / 2 - 3px)`,
      top: '9px',
      width: '7px',
      height: '7px',
      borderRadius: vars.radius.full,
      background: vars.color.bg.base,
      border: `1px solid ${vars.color.border.strong}`,
      transition: `background ${vars.motion.durationSlow} ${vars.motion.easeStandard}, border-color ${vars.motion.durationSlow} ${vars.motion.easeStandard}`,
    },
  },
});

export const beatDotActive = style({
  '@media': {
    [breakpoints.lg]: {
      background: vars.color.accent,
      borderColor: vars.color.accent,
    },
  },
});

export const beatBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  minWidth: 0,
});

export const beatTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingMd,
  lineHeight: vars.lineHeight.landingMd,
  fontWeight: 600,
  letterSpacing: '-0.025em',
  color: vars.color.text.primary,
});

export const beatText = style({
  maxWidth: '40ch',
  fontSize: vars.fontSize.bodyLg,
  lineHeight: 1.55,
  color: vars.color.text.secondary,
});

export const beatFact = style({
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: vars.space[3],
  marginTop: vars.space[1],
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.accent,
});

export const beatFactLabel = style({
  color: vars.color.text.secondary,
});

export const beatPhone = style({
  marginTop: vars.space[6],
  display: 'flex',
  justifyContent: 'center',
  gridColumn: '1 / -1',
  '@media': {
    [mobile]: {
      alignSelf: 'stretch',
      width: '100%',
      marginTop: vars.space[3],
      paddingTop: vars.space[4],
    },
    [breakpoints.xl]: { display: 'none' },
  },
});

export const beatPhoneForced = style({
  '@media': {
    [breakpoints.xl]: { display: 'flex' },
  },
});

export const stickyCol = style({
  display: 'none',
  '@media': {
    [breakpoints.xl]: {
      display: 'block',
      position: 'sticky',
      top: vars.space[4],
      zIndex: vars.z.sticky,
      alignSelf: 'start',
      width: '100%',
      minWidth: 0,
    },
  },
});

export const stickyInner = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: `calc(100dvh - ${vars.size.controlMd} - ${vars.space[12]})`,
});

const phoneOuter = `calc(${vars.layout.landingPhoneWidth} + ${vars.layout.landingPhoneBezel} * 2)`;
const phoneOuterLg = `calc(${vars.layout.landingPhoneWidthLg} + ${vars.layout.landingPhoneBezel} * 2)`;

export const phoneStage = style({
  width: '100%',
  maxWidth: phoneOuter,
  marginInline: 'auto',
  '@media': {
    [breakpoints.wide]: {
      maxWidth: phoneOuterLg,
    },
  },
});

export const phoneScreen = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});
