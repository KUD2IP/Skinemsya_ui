import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

const breathe = keyframes({
  '0%, 100%': { opacity: 0.4, transform: 'scaleX(0.7)' },
  '50%': { opacity: 1, transform: 'scaleX(1)' },
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

/** Пропорция совпадает с viewBox знака, иначе SVG перерастает контейнер. */
export const stage = style({
  position: 'relative',
  width: 'min(124px, 32vw)',
  aspectRatio: '555 / 720',
});

/** Ореол, вспыхивающий в момент, когда знак собрался. */
export const halo = style({
  position: 'absolute',
  inset: '-18%',
  borderRadius: vars.radius.full,
  background: `radial-gradient(circle, color-mix(in srgb, ${vars.color.accent} 34%, transparent), transparent 66%)`,
  filter: 'blur(26px)',
  pointerEvents: 'none',
});

export const svg = style({
  position: 'relative',
  display: 'block',
  width: '100%',
  height: '100%',
  overflow: 'visible',
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
  display: 'flex',
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
  height: '3px',
  borderRadius: vars.radius.full,
  background: vars.color.green[500],
  animation: `${breathe} 1.4s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.7 },
  },
});
