import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[3],
  cursor: 'pointer',
});

export const control = style({
  position: 'relative',
  width: '46px',
  height: '28px',
  flexShrink: 0,
  borderRadius: vars.radius.full,
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.default}`,
  transition: `background ${vars.motion.durationBase} ${vars.motion.easeStandard}, border-color ${vars.motion.durationBase} ${vars.motion.easeStandard}`,
  selectors: {
    '&[data-state="checked"]': {
      backgroundImage: vars.gradient.brand,
      borderColor: 'transparent',
      boxShadow: vars.shadow.glowSoft,
    },
    '&[data-focus]': { boxShadow: `0 0 0 3px ${vars.color.focusRing}` },
  },
});

export const thumb = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '22px',
  height: '22px',
  borderRadius: vars.radius.full,
  background: vars.color.text.primary,
  boxShadow: vars.shadow.sm,
  transition: `transform ${vars.motion.durationBase} ${vars.motion.easeSpring}`,
  selectors: {
    '&[data-state="checked"]': { transform: 'translateX(18px)', background: '#fff' },
  },
});

export const label = style({
  fontSize: vars.fontSize.body,
  color: vars.color.text.primary,
});
