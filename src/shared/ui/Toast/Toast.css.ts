import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const viewport = style({
  position: 'fixed',
  top: `calc(${vars.layout.safeTop} + ${vars.space[3]} + 3px)`,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: Number(vars.z.toast),
  width: '100%',
  maxWidth: vars.layout.contentMaxWidth,
  padding: `0 ${vars.space[5]}`,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
});

export const toastBase = style({
  pointerEvents: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  maxWidth: '100%',
  padding: `${vars.space[2]} ${vars.space[4]}`,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.full,
  boxShadow: vars.shadow.md,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.primary,
  backdropFilter: 'blur(12px)',
});

export const toastInner = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
});

export const toastIcon = style({
  flexShrink: 0,
});

export const toastMessage = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const tone = styleVariants({
  success: {
    borderColor: vars.color.green[800],
    background: vars.color.successBg,
    color: vars.color.green[200],
  },
  warning: {
    borderColor: vars.color.warning,
    background: vars.color.warningBg,
    color: vars.color.warning,
  },
  danger: {
    borderColor: vars.color.danger,
    background: vars.color.dangerBg,
    color: vars.color.danger,
  },
  neutral: {
    borderColor: vars.color.border.default,
    background: vars.color.bg.elevated,
    color: vars.color.text.secondary,
  },
});
