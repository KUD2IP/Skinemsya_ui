import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const switcher = style({
  display: 'flex',
  gap: vars.space[2],
  overflowX: 'auto',
  paddingBottom: vars.space[1],
});

export const chip = style({
  flex: '0 0 auto',
  selectors: {
    '&&': { boxShadow: 'none' },
    '&&:hover': { boxShadow: 'none' },
    '&&:focus-visible': { boxShadow: `0 0 0 3px ${vars.color.focusRing}` },
  },
});
