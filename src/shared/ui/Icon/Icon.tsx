import type { Icon as PhosphorIcon, IconWeight } from '@phosphor-icons/react';
import { cx } from '@/shared/lib';
import { glyph } from './Icon.css';

type IconSize = 'sm' | 'md' | 'lg';

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
  return (
    <Glyph weight={weight} color={color} className={cx(glyph[size], className)} />
  );
}
