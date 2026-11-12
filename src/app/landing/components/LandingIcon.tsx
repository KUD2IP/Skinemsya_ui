import type { IconWeight } from '@phosphor-icons/react';
import { Icon, type IconProps } from '@/shared/ui';

export type LandingIconProps = Omit<IconProps, 'weight'> & {
  weight?: IconWeight;
};

/** Иконки мокапов лендинга без duotone-подложки Phosphor. */
export function LandingIcon({ weight = 'bold', ...props }: LandingIconProps) {
  return <Icon weight={weight} {...props} />;
}
