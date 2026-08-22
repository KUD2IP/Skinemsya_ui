import { cx } from '@/shared/lib';
import * as css from './CountField.css';

interface CountFieldProps {
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  invalid?: boolean;
  placeholder?: string;
  ariaLabel?: string;
}

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function CountField({
  value,
  onChange,
  min = 2,
  max = 99,
  invalid,
  placeholder,
  ariaLabel,
}: CountFieldProps) {
  const numeric = typeof value === 'number' ? value : 0;

  const commit = (next: number | '') => {
    if (next === '') {
      onChange('');
      return;
    }
    onChange(Math.min(max, Math.max(min, next)));
  };

  return (
    <div className={cx(css.stepper, invalid && css.invalid)}>
      <button
        type="button"
        className={css.btn}
        aria-label="Меньше"
        disabled={numeric <= min}
        onClick={() => commit(numeric - 1)}
      >
        −
      </button>
      <input
        className={css.input}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        aria-label={ariaLabel ?? 'Количество человек'}
        aria-invalid={invalid || undefined}
        placeholder={placeholder}
        value={value === '' ? '' : String(value)}
        onChange={(event) => {
          const digits = digitsOnly(event.target.value);
          if (!digits) {
            onChange('');
            return;
          }
          const next = Number(digits);
          if (!Number.isFinite(next)) {
            onChange('');
            return;
          }
          onChange(Math.min(max, next));
        }}
        onBlur={() => {
          if (value === '') return;
          commit(value);
        }}
      />
      <button
        type="button"
        className={css.btn}
        aria-label="Больше"
        disabled={numeric >= max}
        onClick={() => commit((value === '' ? min : numeric) + 1)}
      >
        +
      </button>
    </div>
  );
}
