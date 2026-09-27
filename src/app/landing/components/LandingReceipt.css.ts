import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

/** Зубчатый низ — две mask-слоя: скруглённые вырезы снизу + сплошная заливка остального. */
const scallop = {
  maskImage:
    'radial-gradient(circle at 5px 100%, transparent 0 5px, #000 5.5px), linear-gradient(#000, #000)',
  maskSize: '10px 10px, 100% calc(100% - 10px)',
  maskRepeat: 'repeat-x, no-repeat',
  maskPosition: 'bottom left, top left',
  WebkitMaskImage:
    'radial-gradient(circle at 5px 100%, transparent 0 5px, #000 5.5px), linear-gradient(#000, #000)',
  WebkitMaskSize: '10px 10px, 100% calc(100% - 10px)',
  WebkitMaskRepeat: 'repeat-x, no-repeat',
  WebkitMaskPosition: 'bottom left, top left',
} as const;

export const root = style({
  ...scallop,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  paddingInline: vars.space[5],
  paddingTop: vars.space[5],
  paddingBottom: vars.space[8],
  background: vars.color.bg.inset,
  border: `1px solid ${vars.color.border.subtle}`,
  borderRadius: `${vars.radius.md} ${vars.radius.md} 0 0`,
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
});

export const head = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  paddingBottom: vars.space[4],
  borderBottom: `1px dashed ${vars.color.border.default}`,
});

export const place = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  fontWeight: 600,
  color: vars.color.text.secondary,
  letterSpacing: '0.04em',
});

export const when = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});

export const rows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const row = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space[3],
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.text.muted,
});

export const name = style({
  flexShrink: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const leader = style({
  flex: 1,
  minWidth: vars.space[5],
  alignSelf: 'center',
  borderBottom: `1px dotted ${vars.color.border.default}`,
  transformOrigin: 'left center',
});

export const value = style({
  flexShrink: 0,
  color: vars.color.text.secondary,
  whiteSpace: 'nowrap',
});

export const total = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space[3],
  paddingTop: vars.space[4],
  borderTop: `1px dashed ${vars.color.border.default}`,
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  fontWeight: 700,
  color: vars.color.text.primary,
  letterSpacing: '0.06em',
});

export const totalValue = style({
  flexShrink: 0,
  marginLeft: 'auto',
  color: vars.color.accent,
  whiteSpace: 'nowrap',
});
