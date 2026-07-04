import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const card = recipe({
  base: {
    borderRadius: vars.radius.xl,
    border: `1px solid ${vars.color.border.subtle}`,
    overflow: 'hidden',
  },
  variants: {
    variant: {
      surface: { background: vars.color.bg.surface },
      elevated: { background: vars.color.bg.elevated, boxShadow: vars.shadow.md },
      hero: {
        backgroundImage: vars.gradient.surface,
        borderColor: vars.color.border.default,
        boxShadow: vars.shadow.md,
      },
    },
    padding: {
      none: { padding: '0' },
      sm: { padding: vars.space[5] },
      md: { padding: vars.space[6] },
      lg: { padding: vars.space[7] },
    },
  },
  defaultVariants: { variant: 'surface', padding: 'md' },
});

export type CardVariants = NonNullable<RecipeVariants<typeof card>>;
