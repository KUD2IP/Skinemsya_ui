import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const scenario = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
});

export const iconSlot = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.iconSm,
  height: vars.size.iconSm,
  lineHeight: 0,
});

export const dockedFooter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  marginTop: vars.space[2],
  paddingTop: vars.space[4],
  borderTop: `1px solid ${vars.color.border.subtle}`,
});
