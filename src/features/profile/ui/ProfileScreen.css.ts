import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const heroRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[5],
});

export const heroName = style({
  fontSize: vars.fontSize.h2,
  lineHeight: vars.lineHeight.h2,
  fontWeight: 700,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const heroMeta = style({
  fontSize: vars.fontSize.bodySm,
  color: vars.color.text.secondary,
});

export const subscriptionTitle = style({
  fontSize: vars.fontSize.h3,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const sectionLabel = style({
  fontSize: vars.fontSize.caption,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: vars.color.text.muted,
  paddingInline: vars.space[2],
});

export const valueMono = style({
  fontFamily: vars.font.mono,
  color: vars.color.text.primary,
});

export const muted = style({
  color: vars.color.text.muted,
});

export const inlineEditor = style({
  padding: vars.space[4],
  borderTop: `1px solid ${vars.color.border.subtle}`,
});

export const blockTitle = style({
  fontSize: vars.fontSize.h3,
  lineHeight: vars.lineHeight.h3,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const linkStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const linkCard = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  width: '100%',
  minHeight: vars.size.controlLg,
  padding: `${vars.space[4]} ${vars.space[5]}`,
  background: vars.color.bg.surface,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.xl,
  color: 'inherit',
  textAlign: 'left',
  textDecoration: 'none',
  cursor: 'pointer',
  selectors: {
    '&:active': { background: vars.color.bg.elevated },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `inset 0 0 0 2px ${vars.color.focusRing}`,
    },
  },
});

export const linkIcon = style({
  flexShrink: 0,
  color: vars.color.text.secondary,
});

export const linkBody = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const linkTitle = style({
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 700,
  color: vars.color.text.primary,
});

export const linkSubtitle = style({
  fontSize: vars.fontSize.bodySm,
  lineHeight: vars.lineHeight.bodySm,
  color: vars.color.text.secondary,
});

export const linkChevron = style({
  flexShrink: 0,
  color: vars.color.text.muted,
});
