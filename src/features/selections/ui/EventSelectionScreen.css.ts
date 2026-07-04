import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

const stickyActionBarInset = `calc(${vars.size.controlMd} + ${vars.space[8]} + ${vars.space[7]} + ${vars.space[4]} + ${vars.space[4]} + ${vars.layout.safeBottom})`;

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  paddingBottom: stickyActionBarInset,
});

export const receiptLink = style({
  marginBottom: vars.space[2],
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[4],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.subtle}`,
});

export const rowMain = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const name = style({
  fontSize: vars.fontSize.body,
  fontWeight: 600,
});

export const meta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const qtyControls = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
});

export const qtyValue = style({
  minWidth: 28,
  textAlign: 'center',
  fontWeight: 600,
});

export const qtyStepper = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
});

export const qtyBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.text.primary,
  fontSize: '1.25rem',
  lineHeight: 1,
  cursor: 'pointer',
  selectors: {
    '&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
  },
});

export const rowSoldOut = style({
  opacity: 0.55,
});

export const nameSoldOut = style({
  textDecoration: 'line-through',
  color: vars.color.text.secondary,
});

export const stickyFooter = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  padding: vars.space[4],
  paddingBottom: `calc(${vars.space[4]} + ${vars.layout.safeBottom})`,
  background: vars.color.bg.base,
  borderTop: `1px solid ${vars.color.border.subtle}`,
  zIndex: vars.z.sticky,
});

export const footerSum = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const footerAmount = style({
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const waitCard = style({
  padding: vars.space[6],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.elevated,
  textAlign: 'center',
  color: vars.color.text.secondary,
});
