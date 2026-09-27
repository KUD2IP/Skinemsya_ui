import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const hero = style({
  position: 'relative',
});

export const grid = style({
  display: 'grid',
  gap: vars.space[9],
  alignItems: 'center',
  width: '100%',
  '@media': {
    [breakpoints.lg]: {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      alignItems: 'start',
      gap: vars.space[9],
    },
    [breakpoints.wide]: {
      gridTemplateColumns: 'minmax(0, 42%) minmax(0, 58%)',
      gap: vars.space[7],
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

/** Отметка вечера моноширинным — задаёт сюжет без uppercase-надстрочника. */
export const stamp = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
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
  fontWeight: 700,
  letterSpacing: '-0.035em',
  color: vars.color.text.primary,
  textWrap: 'balance',
});

/** Сумма отсчитывается вверх — табличные цифры, чтобы строка не дёргалась по ширине. */
export const titleAmount = style({
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
});

export const titleAccent = style({
  color: vars.color.accent,
});

export const subtitle = style({
  fontSize: vars.fontSize.bodyLg,
  lineHeight: 1.55,
  color: vars.color.text.secondary,
  maxWidth: '50ch',
});

export const ctaBlock = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[3],
  width: '100%',
  maxWidth: '380px',
  '@media': {
    [breakpoints.md]: {
      maxWidth: '100%',
    },
  },
});

export const trust = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});

export const scrollHint = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  color: vars.color.text.muted,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  textDecoration: 'none',
  transition: `color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: { '&:hover': { color: vars.color.text.link } },
});

export const visual = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 0,
  width: '100%',
  perspective: '1400px',
  '@media': {
    [breakpoints.lg]: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
  },
});

export const visualStack = style({
  position: 'relative',
  width: 'fit-content',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    [breakpoints.lg]: {
      marginInlineStart: 'auto',
    },
    [breakpoints.wide]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: vars.space[7],
    },
  },
});

/**
 * Бумажный чек — «до»: лежит слева, телефон накрывает только его правое поле.
 * Показываем с 1180px, где колонка достаточно широкая, чтобы суммы не уходили под телефон.
 */
const phoneOuter = `calc(${vars.layout.landingPhoneWidth} + ${vars.layout.landingPhoneBezel} * 2)`;
const phoneOuterLg = `calc(${vars.layout.landingPhoneWidthLg} + ${vars.layout.landingPhoneBezel} * 2)`;

export const receipt = style({
  display: 'none',
  '@media': {
    [breakpoints.wide]: {
      display: 'block',
      flexShrink: 0,
      width: '220px',
      transform: 'translateY(-4%) rotate(-6deg)',
      transformOrigin: 'center',
      filter: `drop-shadow(0 18px 28px color-mix(in srgb, ${vars.color.bg.base} 85%, transparent))`,
      pointerEvents: 'none',
    },
  },
});

export const phoneWrap = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  flexShrink: 0,
  width: '100%',
  maxWidth: phoneOuter,
  transformStyle: 'preserve-3d',
  '@media': {
    [breakpoints.wide]: {
      maxWidth: phoneOuterLg,
    },
  },
});

export const glow = style({
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  width: '380px',
  height: '380px',
  borderRadius: vars.radius.full,
  background: `color-mix(in srgb, ${vars.color.accent} 15%, transparent)`,
  filter: 'blur(90px)',
  pointerEvents: 'none',
  zIndex: 0,
});
