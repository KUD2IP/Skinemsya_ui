import { useMemo, useState, type ReactNode } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { haptics } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';
import { Input } from '@/shared/ui/Input';
import { OptionPicker, type OptionPickerItem } from '@/shared/ui/OptionPicker';
import { Sheet } from '@/shared/ui/Sheet';
import * as css from './SelectField.css';

export interface SelectFieldItem<T extends string | number> extends OptionPickerItem<T> {
  leading?: ReactNode;
}

export interface SelectFieldProps<T extends string | number> {
  items: SelectFieldItem<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  pickerTitle?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  ariaLabel: string;
}

/** Компактный trigger + nested sheet с поиском для длинных списков. */
export function SelectField<T extends string | number>({
  items,
  value,
  onChange,
  placeholder = 'Выберите…',
  pickerTitle = 'Выбор',
  searchPlaceholder = 'Поиск…',
  disabled,
  ariaLabel,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = items.find((item) => item.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint?.toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleSelect = (next: T) => {
    onChange(next);
    setOpen(false);
    setQuery('');
  };

  const handleClosed = () => setQuery('');

  return (
    <>
      <button
        type="button"
        className={css.trigger({ placeholder: !selected })}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (disabled) return;
          haptics.tap();
          setOpen(true);
        }}
      >
        {selected?.leading ?? null}
        <span className={css.triggerBody}>
          <span className={css.triggerLabel}>{selected?.label ?? placeholder}</span>
          {selected?.hint ? <span className={css.triggerHint}>{selected.hint}</span> : null}
        </span>
        <span className={css.chevron} aria-hidden>
          <Icon icon={CaretDown} size="sm" />
        </span>
      </button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        onClosed={handleClosed}
        nested
        title={pickerTitle}
      >
        <div className={css.searchWrap}>
          <Input
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={searchPlaceholder}
          />
        </div>
        {filtered.length ? (
          <div className={css.optionsList}>
            <OptionPicker
              ariaLabel={ariaLabel}
              items={filtered}
              value={value ?? filtered[0]!.value}
              onChange={handleSelect}
              variant="list"
            />
          </div>
        ) : (
          <p className={css.emptySearch}>Ничего не найдено</p>
        )}
      </Sheet>
    </>
  );
}
