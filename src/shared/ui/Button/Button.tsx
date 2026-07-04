import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { button, type ButtonVariants } from './Button.css';
import { Spinner } from '@/shared/ui/Spinner';
import { cx, haptics } from '@/shared/lib';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    ButtonVariants {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Тактильная отдача при нажатии (по умолчанию включена). */
  haptic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    fullWidth,
    loading = false,
    leftIcon,
    rightIcon,
    haptic = true,
    disabled,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx(button({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (haptic) haptics.tap();
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? (
        <Spinner size={18} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
});
