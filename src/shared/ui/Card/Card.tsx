import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { card, type CardVariants } from './Card.css';
import { cx } from '@/shared/lib';

export interface CardProps extends HTMLAttributes<HTMLDivElement>, CardVariants {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, padding, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(card({ variant, padding }), className)} {...rest}>
      {children}
    </div>
  );
});
