import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const badge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    padding: `${vars.space[1]} ${vars.space[3]}`,
    borderRadius: vars.radius.full,
    fontSize: vars.fontSize.caption,
    lineHeight: vars.lineHeight.caption,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      brand: { background: vars.color.green[900], color: vars.color.green[300] },
      neutral: { background: vars.color.bg.elevated, color: vars.color.text.secondary },
      success: { background: vars.color.successBg, color: vars.color.success },
      warning: { background: vars.color.warningBg, color: vars.color.warning },
      danger: { background: vars.color.dangerBg, color: vars.color.danger },
    },
  },
  defaultVariants: { tone: 'brand' },
});

export type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>;
