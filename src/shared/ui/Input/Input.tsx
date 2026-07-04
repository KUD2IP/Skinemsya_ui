import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import * as css from './Input.css';
import { cx } from '@/shared/lib';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  mono?: boolean;
  /** Скрыть стрелки у type="number". */
  hideSpinners?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, mono, hideSpinners, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cx(
        css.field,
        invalid && css.invalid,
        mono && css.mono,
        hideSpinners && css.noSpinners,
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cx(css.textarea, invalid && css.invalid, className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
