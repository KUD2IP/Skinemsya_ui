import { style } from '@vanilla-extract/css';
import { vars, breakpoints } from '@/shared/theme';

export const head = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[3],
  paddingBottom: vars.space[5],
  borderBottom: `1px dashed ${vars.color.border.default}`,
  '@media': {
    [breakpoints.md]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: vars.space[4],
    },
  },
});

export const title = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.landingMd,
  lineHeight: vars.lineHeight.landingMd,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
  flexShrink: 0,
});

export const grid = style({
  display: 'grid',
  gap: vars.space[7],
  '@media': {
    [breakpoints.md]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      columnGap: vars.space[10],
      rowGap: vars.space[8],
    },
  },
});

export const item = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  minWidth: 0,
});

export const question = style({
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const answer = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: 1.65,
  color: vars.color.text.muted,
  maxWidth: '48ch',
});
