import type { HTMLAttributes } from 'react';
import { badge, type BadgeVariants } from './Badge.css';
import { cx } from '@/shared/lib';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariants {}

export function Badge({ tone, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx(badge({ tone }), className)} {...rest}>
      {children}
    </span>
  );
}
