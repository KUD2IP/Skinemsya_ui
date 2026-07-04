import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const amountBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  alignItems: 'center',
  padding: vars.space[6],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.elevated,
});

export const amountLabel = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const amountValue = style({
  fontSize: '2rem',
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const detailsCard = style({
  padding: vars.space[5],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.subtle}`,
});

export const creditorName = style({
  fontWeight: 600,
});

export const detailRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
});

export const detailLabel = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.muted,
});

export const detailsText = style({
  whiteSpace: 'pre-wrap',
  color: vars.color.text.secondary,
  lineHeight: vars.lineHeight.body,
});

export const detailsMeta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.muted,
});

export const hint = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.muted,
  textAlign: 'center',
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
