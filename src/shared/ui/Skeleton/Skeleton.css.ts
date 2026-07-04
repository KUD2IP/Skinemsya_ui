import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

export const skeleton = style({
  display: 'block',
  borderRadius: vars.radius.md,
  background: `linear-gradient(90deg, ${vars.color.bg.elevated} 25%, ${vars.color.border.default} 37%, ${vars.color.bg.elevated} 63%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.2s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.6 },
  },
});
