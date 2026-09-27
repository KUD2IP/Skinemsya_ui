import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const root = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[2],
  },
  variants: {
    compact: {
      true: {
        width: 'auto',
        alignItems: 'flex-end',
      },
      false: {
        width: '100%',
        alignItems: 'stretch',
      },
    },
  },
  defaultVariants: { compact: false },
});

export const hint = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.muted,
  textAlign: 'center',
});

export const ctaFull = style({
  '@media': {
    'screen and (max-width: 479px)': { display: 'none' },
  },
});

export const ctaShort = style({
  display: 'none',
  '@media': {
    'screen and (max-width: 479px)': { display: 'inline' },
  },
});
