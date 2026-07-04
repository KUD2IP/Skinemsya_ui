import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  width: '100%',
});

export const wrap = style({
  position: 'relative',
  width: '100%',
});

export const brand = style({
  position: 'absolute',
  right: vars.space[4],
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
  pointerEvents: 'none',
  userSelect: 'none',
});

export const inputWithBrand = style({
  paddingRight: vars.space[12],
});

export const brandsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[2],
});

export const brandsLabel = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.text.muted,
  marginRight: vars.space[1],
});

export const brandBadge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${vars.space[1]} ${vars.space[3]}`,
    borderRadius: vars.radius.sm,
    fontSize: vars.fontSize.caption,
    fontFamily: vars.font.mono,
    border: `1px solid ${vars.color.border.subtle}`,
    color: vars.color.text.muted,
    background: vars.color.bg.inset,
    transition: `color ${vars.motion.durationFast} ${vars.motion.easeStandard}, border-color ${vars.motion.durationFast} ${vars.motion.easeStandard}, background ${vars.motion.durationFast} ${vars.motion.easeStandard}`,
  },
  variants: {
    active: {
      true: {
        color: vars.color.green[300],
        borderColor: vars.color.green[700],
        background: vars.color.green[900],
      },
    },
  },
});
