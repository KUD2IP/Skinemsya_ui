import type { CSSProperties } from 'react';
import { skeleton } from './Skeleton.css';
import { cx } from '@/shared/lib';
import { vars } from '@/shared/theme';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: keyof typeof vars.radius;
  circle?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width, height = 16, radius, circle, className, style }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cx(skeleton, className)}
      style={{
        width,
        height,
        borderRadius: circle ? vars.radius.full : radius ? vars.radius[radius] : undefined,
        ...style,
      }}
    />
  );
}
