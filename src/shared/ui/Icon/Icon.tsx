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
 * Единый адаптер иконок Phosphor. Вес bold: у duotone вторая заливка
 * на тёмном фоне выглядит серым кругом за глифом.
 */
export function Icon({
  icon: Glyph,
  size = 'md',
  weight = 'bold',
  color = 'currentColor',
  className,
}: IconProps) {
  return <Glyph size={SIZE[size]} weight={weight} color={color} className={className} />;
}
