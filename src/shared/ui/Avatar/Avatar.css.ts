import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const avatar = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: vars.radius.full,
    overflow: 'hidden',
    background: vars.color.green[900],
    color: vars.color.green[300],
    fontWeight: 600,
    objectFit: 'cover',
    userSelect: 'none',
  },
  variants: {
    size: {
      sm: { width: vars.size.avatarSm, height: vars.size.avatarSm, fontSize: vars.fontSize.bodySm },
      md: { width: vars.size.avatarMd, height: vars.size.avatarMd, fontSize: vars.fontSize.body },
      lg: { width: vars.size.avatarLg, height: vars.size.avatarLg, fontSize: vars.fontSize.h2 },
    },
    tone: {
      0: { background: vars.color.green[900], color: vars.color.green[300] },
      1: { background: vars.color.green[800], color: vars.color.green[200] },
      2: { background: vars.color.green[700], color: vars.color.green[100] },
      3: { background: vars.color.bg.elevated, color: vars.color.green[400] },
    },
  },
  defaultVariants: { size: 'md', tone: 0 },
});

export type AvatarVariants = NonNullable<RecipeVariants<typeof avatar>>;
