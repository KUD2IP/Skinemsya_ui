import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const intro = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
});

export const introTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingLg,
  lineHeight: vars.lineHeight.landingLg,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
  maxWidth: '20ch',
});

export const introText = style({
  maxWidth: '46ch',
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
      columnGap: vars.space[8],
    },
  },
});

const mobile = 'screen and (max-width: 767px)';

export const beats = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[12],
  minWidth: 0,
  '@media': {
    [mobile]: { gap: vars.space[10] },
    /** Запас снизу: sticky-телефон должен оставаться закреплённым, пока последняя сцена в центре. */
    [breakpoints.xl]: { gap: 0, paddingBottom: '26vh' },
  },
});

/** Дорожка таймлайна: серый рельс под всеми отметками времени. */
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

/** Заполнение рельса по мере прокрутки вечера. */
export const railFill = style({
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(to bottom, ${vars.color.accent}, ${vars.color.green[600]})`,
  transformOrigin: 'top center',
});

export const beat = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: `${vars.space[12]} minmax(0, 1fr)`,
  columnGap: vars.space[5],
  alignItems: 'start',
  transition: `opacity 0.55s ${vars.motion.easeStandard}`,
  '@media': {
    [mobile]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
      gap: vars.space[5],
      padding: vars.space[5],
      borderRadius: vars.radius.xl,
      background: vars.color.bg.surface,
      border: `1px solid ${vars.color.border.subtle}`,
    },
    [breakpoints.xl]: {
      minHeight: '62vh',
      alignContent: 'center',
      columnGap: vars.space[7],
    },
  },
});

/** Отметка времени вечера вместо порядкового номера — держит сюжет, а не нумерует «шаги». */
export const beatTime = style({
  position: 'relative',
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 500,
  color: vars.color.text.muted,
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

/** Точка на рельсе напротив отметки времени. */
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
      transition: `background 0.55s ${vars.motion.easeStandard}, border-color 0.55s ${vars.motion.easeStandard}, box-shadow 0.55s ${vars.motion.easeStandard}`,
    },
  },
});

export const beatDotActive = style({
  '@media': {
    [breakpoints.lg]: {
      background: vars.color.accent,
      borderColor: vars.color.accent,
      boxShadow: vars.shadow.glowSoft,
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
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
});

export const beatText = style({
  maxWidth: '42ch',
  fontSize: vars.fontSize.bodyLg,
  lineHeight: 1.6,
  color: vars.color.text.secondary,
});

export const beatFact = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space[3],
  marginTop: vars.space[1],
  '@media': {
    [mobile]: {
      marginTop: vars.space[2],
      paddingTop: vars.space[4],
      borderTop: `1px solid ${vars.color.border.subtle}`,
    },
  },
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.accent,
});

export const beatFactLabel = style({
  color: vars.color.text.muted,
});

/** Телефон под текстом — только на узких экранах и при reduced motion. */
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
      paddingTop: vars.space[5],
      justifyContent: 'center',
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
      zIndex: Number(vars.z.sticky),
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
  perspective: '1600px',
});

export const stickyGlow = style({
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  width: '380px',
  height: '380px',
  borderRadius: vars.radius.full,
  background: `color-mix(in srgb, ${vars.color.accent} 12%, transparent)`,
  filter: 'blur(90px)',
  pointerEvents: 'none',
});

const phoneOuter = `calc(${vars.layout.landingPhoneWidth} + ${vars.layout.landingPhoneBezel} * 2)`;
const phoneOuterLg = `calc(${vars.layout.landingPhoneWidthLg} + ${vars.layout.landingPhoneBezel} * 2)`;

export const phoneStage = style({
  transformStyle: 'preserve-3d',
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
