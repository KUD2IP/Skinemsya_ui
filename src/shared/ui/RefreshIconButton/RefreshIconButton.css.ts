import { keyframes, style } from '@vanilla-extract/css';

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

export const icon = style({
  display: 'flex',
});

export const spinning = style({
  animation: `${spin} 0.7s linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});
