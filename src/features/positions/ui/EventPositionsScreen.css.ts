import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.subtle}`,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
});

export const name = style({
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const meta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const price = style({
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  color: vars.color.text.primary,
  whiteSpace: 'nowrap',
});

export const actions = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: vars.space[2],
});

export const actionButton = style({
  minWidth: 0,
});

export const lowConfidence = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.warning,
});

export const lowConfidenceRow = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[2],
});

export const sharedBadge = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.green[300],
});

export const tipsBadge = style({
  alignSelf: 'flex-start',
});

export const page = style({
  display: 'flex',
  flexDirection: 'column',
});

const stickyActionBarInset = `calc(${vars.size.controlMd} + ${vars.space[8]} + ${vars.space[7]} + ${vars.space[4]} + ${vars.space[4]} + ${vars.layout.safeBottom})`;

export const screenBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  paddingBottom: stickyActionBarInset,
});

export const banner = style({
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.body,
});

export const bannerInfo = style([
  banner,
  {
    background: vars.color.bg.elevated,
    color: vars.color.text.secondary,
    border: `1px solid ${vars.color.border.subtle}`,
  },
]);

export const bannerWarning = style([
  banner,
  {
    background: vars.color.warningBg,
    color: vars.color.warning,
  },
]);

export const bannerError = style([
  banner,
  {
    background: vars.color.dangerBg,
    color: vars.color.danger,
  },
]);

export const uploadRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
});

export const hiddenInput = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
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

export const footerPreview = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const footerTotal = style({
  fontSize: vars.fontSize.body,
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const gateCard = style({
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  background: vars.color.warningBg,
  color: vars.color.warning,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});
