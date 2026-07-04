import type { Icon as PhosphorIcon, IconWeight } from '@phosphor-icons/react';
import { vars } from '@/shared/theme';

type IconSize = 'sm' | 'md' | 'lg';

const SIZE: Record<IconSize, string> = {
  sm: vars.size.iconSm,
  md: vars.size.iconMd,
  lg: vars.size.iconLg,
};

export interface IconProps {
  icon: PhosphorIcon;
  size?: IconSize;
  weight?: IconWeight;
  color?: string;
  className?: string;
}

/**
 * Единый адаптер иконок Phosphor (по умолчанию duotone) — фирменный почерк.
 * Меняя набор/вес здесь, обновляем иконки во всём приложении.
 */
export function Icon({
  icon: Glyph,
  size = 'md',
  weight = 'duotone',
  color = 'currentColor',
  className,
}: IconProps) {
  return <Glyph size={SIZE[size]} weight={weight} color={color} className={className} />;
}
