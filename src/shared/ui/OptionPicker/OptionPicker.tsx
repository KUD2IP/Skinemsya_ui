import { haptics } from '@/shared/lib';
import * as css from './OptionPicker.css';

export interface OptionPickerItem<T extends string | number> {
  value: T;
  label: string;
  hint?: string;
}

export interface OptionPickerProps<T extends string | number> {
  items: OptionPickerItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  variant?: 'cards' | 'list';
}

/** Список опций с одиночным выбором — accent-bar вместо галки. */
export function OptionPicker<T extends string | number>({
  items,
  value,
  onChange,
  ariaLabel,
  variant = 'cards',
}: OptionPickerProps<T>) {
  if (variant === 'list') {
    return (
      <div className={css.listPanel} role="radiogroup" aria-label={ariaLabel}>
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <button
              key={String(item.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              className={css.listOption({ selected })}
              onClick={() => {
                haptics.select();
                onChange(item.value);
              }}
            >
              <span className={css.listOptionBody}>
                <span className={css.optionLabel}>{item.label}</span>
                {item.hint ? <span className={css.listOptionHint}>{item.hint}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={css.list} role="radiogroup" aria-label={ariaLabel}>
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={String(item.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            className={css.option({ selected })}
            onClick={() => {
              haptics.select();
              onChange(item.value);
            }}
          >
            <span className={css.optionLabel}>{item.label}</span>
            {item.hint ? <span className={css.optionHint}>{item.hint}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
