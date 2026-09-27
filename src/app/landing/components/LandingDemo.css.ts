import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

/** Корень мокапа внутри `LandingPhone` — без safe-area приложения. */
export const frame = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  minHeight: 0,
});

export const demoHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[2],
  minHeight: vars.size.controlSm,
  minWidth: 0,
});

export const demoHeaderLeading = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.controlSm,
  height: vars.size.controlSm,
  lineHeight: 0,
  color: vars.color.text.secondary,
});

export const demoHeaderMain = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  alignSelf: 'center',
});

export const demoHeaderTitle = style({
  minWidth: 0,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const demoHeaderSubtitle = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

/** Фиксирует габарит SVG Phosphor в узком мокапе. */
export const iconSlot = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.iconSm,
  height: vars.size.iconSm,
  lineHeight: 0,
});

/** Тело экрана без отступа под fixed-footer приложения. */
export const scrollBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
});

/** Нижняя панель внутри скролла телефона (не `position: fixed` как в приложении). */
export const dockedFooter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  marginTop: vars.space[2],
  paddingTop: vars.space[4],
  borderTop: `1px solid ${vars.color.border.subtle}`,
});
