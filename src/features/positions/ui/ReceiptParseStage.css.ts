import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

const scan = keyframes({
  '0%': { top: '14%', opacity: 0 },
  '12%': { opacity: 1 },
  '88%': { opacity: 1 },
  '100%': { top: '72%', opacity: 0 },
});

const glow = keyframes({
  '0%, 100%': { opacity: 0.45, transform: 'scale(0.96)' },
  '50%': { opacity: 1, transform: 'scale(1)' },
});

const bar = keyframes({
  '0%, 100%': { opacity: 0.28 },
  '45%': { opacity: 1 },
  '70%': { opacity: 0.45 },
});

const sweep = keyframes({
  '0%': { transform: 'translateX(-140%)', opacity: 0 },
  '16%': { opacity: 1 },
  '84%': { opacity: 1 },
  '100%': { transform: 'translateX(280%)', opacity: 0 },
});

const scallop = {
  maskImage:
    'radial-gradient(circle at 6px 100%, transparent 0 6px, #000 6.5px), linear-gradient(#000, #000)',
  maskSize: '12px 12px, 100% calc(100% - 12px)',
  maskRepeat: 'repeat-x, no-repeat',
  maskPosition: 'bottom left, top left',
  WebkitMaskImage:
    'radial-gradient(circle at 6px 100%, transparent 0 6px, #000 6.5px), linear-gradient(#000, #000)',
  WebkitMaskSize: '12px 12px, 100% calc(100% - 12px)',
  WebkitMaskRepeat: 'repeat-x, no-repeat',
  WebkitMaskPosition: 'bottom left, top left',
} as const;

export const stage = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[8],
  minHeight: 'calc(100dvh - 148px)',
  paddingBlock: vars.space[8],
});

export const halo = style({
  position: 'absolute',
  top: '12%',
  width: '240px',
  height: '240px',
  borderRadius: vars.radius.full,
  background: vars.gradient.glowSpot,
  filter: 'blur(8px)',
  pointerEvents: 'none',
  animation: `${glow} 2.8s ${vars.motion.easeStandard} infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.7 },
  },
});

export const paper = style({
  ...scallop,
  position: 'relative',
  zIndex: 1,
  width: 'min(280px, 100%)',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  padding: `${vars.space[6]} ${vars.space[5]} ${vars.space[9]}`,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: `${vars.radius.lg} ${vars.radius.lg} 0 0`,
  boxShadow: vars.shadow.lg,
  overflow: 'hidden',
});

export const beam = style({
  position: 'absolute',
  left: vars.space[4],
  right: vars.space[4],
  height: '2px',
  borderRadius: vars.radius.full,
  background: vars.color.accent,
  boxShadow: `0 0 16px ${vars.color.glow}`,
  animation: `${scan} 2.4s ${vars.motion.easeStandard} infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', top: '46%', opacity: 0.8 },
  },
});

export const head = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  paddingBottom: vars.space[4],
  borderBottom: `1px dashed ${vars.color.border.strong}`,
});

export const headLine = style({
  height: '8px',
  width: '46%',
  borderRadius: vars.radius.full,
  background: vars.color.green[700],
});

export const headLineShort = style({
  height: '6px',
  width: '28%',
  borderRadius: vars.radius.full,
  background: vars.color.border.strong,
});

export const rows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
});

export const row = style({
  height: '8px',
  borderRadius: vars.radius.full,
  background: vars.color.green[400],
  transformOrigin: 'left center',
  animation: `${bar} 2.4s ${vars.motion.easeStandard} infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.7 },
  },
});

export const total = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space[4],
  paddingTop: vars.space[4],
  borderTop: `1px dashed ${vars.color.border.strong}`,
});

export const totalBar = style({
  height: '10px',
  width: '34%',
  borderRadius: vars.radius.full,
  background: vars.color.text.primary,
});

export const copy = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[4],
  width: 'min(340px, 100%)',
  textAlign: 'center',
});

export const phraseSlot = style({
  position: 'relative',
  width: '100%',
  minHeight: '72px',
});

export const phrase = style({
  position: 'absolute',
  inset: 0,
  margin: 0,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.h3,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 600,
  color: vars.color.text.primary,
});

export const hint = style({
  margin: 0,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.secondary,
});

export const track = style({
  width: '148px',
  height: '3px',
  borderRadius: vars.radius.full,
  background: vars.color.border.default,
  overflow: 'hidden',
});

export const trackFill = style({
  display: 'block',
  height: '100%',
  width: '42%',
  borderRadius: vars.radius.full,
  background: vars.gradient.brand,
  animation: `${sweep} 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      width: '62%',
      opacity: 0.85,
      transform: 'none',
    },
  },
});
