import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

export const spinner = style({
  display: 'inline-block',
  borderRadius: vars.radius.full,
  border: '2px solid rgba(255,255,255,0.18)',
  borderTopColor: 'currentColor',
  animation: `${spin} 0.7s linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '1.4s',
    },
  },
});
