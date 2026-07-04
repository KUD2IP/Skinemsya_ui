import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cloneElement } from 'react';
import * as css from './FieldGroup.css';

export interface FieldGroupProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactElement<{ id?: string }>;
}

/** Лейбл + поле + подсказка/ошибка с корректной связкой через id. */
export function FieldGroup({ label, hint, error, children }: FieldGroupProps) {
  const id = useId();
  const control = cloneElement(children, { id: children.props.id ?? id });

  return (
    <div className={css.group}>
      {label != null && (
        <label className={css.label} htmlFor={control.props.id}>
          {label}
        </label>
      )}
      {control}
      {error != null ? (
        <span className={css.error}>{error}</span>
      ) : hint != null ? (
        <span className={css.hint}>{hint}</span>
      ) : null}
    </div>
  );
}
