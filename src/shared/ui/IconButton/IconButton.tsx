import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { iconButton, type IconButtonVariants } from './IconButton.css';
import { cx, haptics } from '@/shared/lib';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    IconButtonVariants {
  'aria-label': string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant, size, className, children, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx(iconButton({ variant, size }), className)}
      onClick={(e) => {
        haptics.tap();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
});
