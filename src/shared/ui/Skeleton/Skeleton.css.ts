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

export const list = style({
  background: vars.color.bg.surface,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.subtle}`,
  overflow: 'hidden',
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  minHeight: vars.size.controlLg,
  padding: `${vars.space[3]} ${vars.space[5]}`,
  selectors: {
    '&:not(:last-child)': {
      boxShadow: `inset 0 -1px 0 ${vars.color.border.subtle}`,
    },
  },
});

export const lines = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.surface,
  border: `1px solid ${vars.color.border.subtle}`,
});
