import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

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
  gap: vars.space[5],
  boxSizing: 'border-box',
  paddingInline: vars.space[6],
  paddingTop: vars.space[6],
  paddingBottom: vars.space[9],
  background: vars.color.paper.base,
  color: vars.color.paper.ink,
  fontFamily: vars.font.mono,
  fontFeatureSettings: '"tnum"',
});

export const head = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  paddingBottom: vars.space[5],
  borderBottom: `1px dashed ${vars.color.paper.line}`,
});

export const place = style({
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 700,
  color: vars.color.paper.ink,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
});

export const when = style({
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.paper.secondary,
});

export const rows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
});

export const row = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space[3],
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.paper.secondary,
});

export const name = style({
  flexShrink: 0,
  maxWidth: '58%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: vars.color.paper.ink,
});

export const leader = style({
  flex: 1,
  minWidth: vars.space[5],
  alignSelf: 'center',
  borderBottom: `1px dotted ${vars.color.paper.line}`,
  transformOrigin: 'left center',
});

export const value = style({
  flexShrink: 0,
  color: vars.color.paper.ink,
  whiteSpace: 'nowrap',
});

export const total = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space[3],
  paddingTop: vars.space[5],
  borderTop: `1px dashed ${vars.color.paper.line}`,
  fontSize: vars.fontSize.h3,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 700,
  color: vars.color.paper.ink,
  letterSpacing: '0.04em',
});

export const totalValue = style({
  flexShrink: 0,
  marginLeft: 'auto',
  color: vars.color.green[800],
  whiteSpace: 'nowrap',
});

export const footnote = style({
  paddingTop: vars.space[2],
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  color: vars.color.paper.secondary,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});
