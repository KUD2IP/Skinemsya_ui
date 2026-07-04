import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

const breathe = keyframes({
  '0%, 100%': { opacity: 0.55, transform: 'scale(1)' },
  '50%': { opacity: 1, transform: 'scale(1.04)' },
});

export const root = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[7],
    background: vars.color.bg.base,
    backgroundImage: vars.gradient.glowSpot,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top',
    padding: vars.space[5],
  },
  variants: {
    layout: {
      overlay: {
        position: 'fixed',
        inset: 0,
        zIndex: Number(vars.z.toast) + 1,
      },
      fill: {
        width: '100%',
        minHeight: '100%',
        flex: 1,
      },
    },
  },
  defaultVariants: { layout: 'overlay' },
});

export const stage = style({
  width: 'min(160px, 40vw)',
  height: 'min(160px, 40vw)',
});

export const textBlock = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
  textAlign: 'center',
  maxWidth: '280px',
});

export const wordmark = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h1,
  lineHeight: vars.lineHeight.h1,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
  '@media': {
    [`screen and (max-width: 359px)`]: {
      fontSize: vars.fontSize.h2,
      lineHeight: vars.lineHeight.h2,
    },
  },
});

export const tagline = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.secondary,
});

export const pulse = style({
  width: '64px',
  height: '4px',
  borderRadius: vars.radius.full,
  background: vars.color.green[700],
  animation: `${breathe} 1.4s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.7 },
  },
});
