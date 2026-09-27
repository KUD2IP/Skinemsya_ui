import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

const BEZEL = vars.layout.landingPhoneBezel;
const SCREEN_RADIUS = vars.layout.landingPhoneRadius;
const PHONE_OUTER = `calc(${vars.layout.landingPhoneWidth} + ${BEZEL} * 2)`;
const PHONE_OUTER_LG = `calc(${vars.layout.landingPhoneWidthLg} + ${BEZEL} * 2)`;

const islandFill = `color-mix(in srgb, ${vars.color.text.inverse} 92%, ${vars.color.bg.inset})`;

/** Корпус: титановая рамка вокруг экрана. Габарит один и тот же для всех мокапов. */
export const device = style({
  position: 'relative',
  width: '100%',
  maxWidth: `min(100%, ${PHONE_OUTER})`,
  minWidth: 0,
  marginInline: 'auto',
  padding: BEZEL,
  borderRadius: `calc(${SCREEN_RADIUS} + ${BEZEL})`,
  background: vars.gradient.deviceFrame,
  boxShadow: `${vars.shadow.lg}, inset 0 0 0 1px color-mix(in srgb, ${vars.color.text.primary} 35%, transparent)`,
  flexShrink: 0,
  pointerEvents: 'none',
  '@media': {
    [breakpoints.wide]: {
      width: PHONE_OUTER_LG,
      maxWidth: PHONE_OUTER_LG,
    },
  },
});

export const screen = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '9 / 19.5',
  borderRadius: SCREEN_RADIUS,
  background: vars.color.bg.base,
  border: `1px solid color-mix(in srgb, ${vars.color.text.inverse} 88%, ${vars.color.bg.base})`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const screenHeader = style({
  position: 'relative',
  zIndex: 3,
  flexShrink: 0,
  background: vars.color.bg.base,
});

export const topBand = style({
  position: 'relative',
  flexShrink: 0,
  minHeight: vars.layout.landingPhoneTopBand,
  paddingTop: vars.space[2],
  paddingBottom: vars.space[2],
  background: vars.color.bg.base,
});

export const island = style({
  position: 'absolute',
  zIndex: 2,
  top: vars.space[4],
  left: '50%',
  transform: 'translateX(-50%)',
  width: '32%',
  height: vars.layout.landingPhoneIslandHeight,
  borderRadius: vars.radius.full,
  background: islandFill,
  boxShadow: `0 1px 2px color-mix(in srgb, ${vars.color.text.primary} 18%, transparent)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingInline: '11%',
  pointerEvents: 'none',
});

export const islandLens = style({
  width: '22%',
  aspectRatio: '1',
  borderRadius: vars.radius.full,
  background: `color-mix(in srgb, ${vars.color.text.muted} 55%, ${vars.color.bg.inset})`,
  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.color.text.primary} 12%, transparent)`,
  flexShrink: 0,
});

export const statusBar = style({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr minmax(0, 34%) 1fr',
  alignItems: 'center',
  minHeight: `calc(${vars.layout.landingPhoneTopBand} - ${vars.space[2]} * 2)`,
  paddingInline: vars.space[5],
  paddingTop: vars.space[1],
  fontFamily: vars.font.sans,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  fontWeight: 600,
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
});

export const statusTime = style({
  justifySelf: 'start',
});

export const statusSpacer = style({
  pointerEvents: 'none',
});

export const statusIcons = style({
  display: 'flex',
  alignItems: 'center',
  justifySelf: 'end',
  gap: vars.space[2],
  color: vars.color.text.primary,
});

/** Шапка Telegram Mini App поверх экрана приложения. */
export const chrome = style({
  display: 'grid',
  gridTemplateColumns: `${vars.size.controlMd} 1fr ${vars.size.controlMd}`,
  alignItems: 'center',
  gap: vars.space[2],
  minHeight: vars.size.controlMd,
  paddingBlock: vars.space[3],
  paddingInline: vars.space[4],
  background: vars.color.bg.elevated,
  borderBottom: `1px solid ${vars.color.border.subtle}`,
});

export const chromeClose = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  color: vars.color.text.secondary,
});

export const chromeMore = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  color: vars.color.text.secondary,
});

export const chromeIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.iconSm,
  height: vars.size.iconSm,
  lineHeight: 0,
  flexShrink: 0,
});

export const chromeTitles = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[1],
  minWidth: 0,
});

export const chromeTitle = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const chromeCaption = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  fontWeight: 500,
  color: vars.color.text.muted,
});

export const content = style({
  position: 'relative',
  zIndex: 1,
  flex: 1,
  minHeight: 0,
  padding: vars.space[4],
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
});

/** Контент, не поместившийся в экран, уходит в затемнение, а не обрывается. */
export const fade = style({
  position: 'absolute',
  zIndex: 4,
  left: 0,
  right: 0,
  bottom: 0,
  height: vars.space[10],
  background: `linear-gradient(to top, ${vars.color.bg.base}, transparent)`,
  pointerEvents: 'none',
});

export const homeBar = style({
  position: 'absolute',
  zIndex: 5,
  bottom: '0.9%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '34%',
  height: '3px',
  borderRadius: vars.radius.full,
  background: vars.color.text.primary,
  opacity: 0.55,
});

const sideButton = {
  position: 'absolute',
  width: '3px',
  borderRadius: vars.radius.full,
  background: vars.gradient.deviceButton,
  opacity: 0.85,
} as const;

export const btnAction = style({
  ...sideButton,
  left: '-1px',
  top: '16%',
  height: '4.5%',
});

export const btnVolumeUp = style({
  ...sideButton,
  left: '-1px',
  top: '24%',
  height: '7.5%',
});

export const btnVolumeDown = style({
  ...sideButton,
  left: '-1px',
  top: '33%',
  height: '7.5%',
});

export const btnPower = style({
  ...sideButton,
  right: '-1px',
  top: '26%',
  height: '11%',
});
