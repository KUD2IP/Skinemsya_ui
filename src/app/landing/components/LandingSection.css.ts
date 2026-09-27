import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

const bleed = {
  marginInline: `calc(${vars.space[5]} * -1)`,
  paddingInline: vars.space[5],
  '@media': {
    [breakpoints.lg]: {
      marginInline: `calc(${vars.space[8]} * -1)`,
      paddingInline: vars.space[8],
    },
  },
} as const;

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: 0,
  gap: vars.space[9],
  paddingBlock: vars.layout.landingSectionY,
  scrollMarginTop: vars.space[3],
});

export const band = style({
  ...bleed,
  background: vars.color.bg.surface,
  borderBlock: `1px solid ${vars.color.border.subtle}`,
});
