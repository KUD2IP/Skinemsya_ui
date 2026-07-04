import { forwardRef, useCallback } from 'react';
import type { InputHTMLAttributes } from 'react';
import {
  CARD_BRAND_LABELS,
  CARD_BRAND_SHORT_LABELS,
  SUPPORTED_CARD_BRANDS,
  detectCardBrand,
  formatCardNumber,
  cx,
} from '@/shared/lib';
import { Input } from '@/shared/ui/Input';
import * as css from './CardInput.css';

export interface CardInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

/** Поле номера карты с автоформатированием, лимитом цифр и подсказкой платёжной системы. */
export const CardInput = forwardRef<HTMLInputElement, CardInputProps>(function CardInput(
  { value, onChange, invalid, className, onBlur, placeholder, ...rest },
  ref,
) {
  const digits = value.replace(/\D/g, '');
  const brand = detectCardBrand(digits);
  const showBrand = digits.length >= 2 && brand !== 'unknown';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(formatCardNumber(e.target.value));
    },
    [onChange],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text');
      onChange(formatCardNumber(pasted));
    },
    [onChange],
  );

  return (
    <div className={css.root}>
      <div className={css.wrap}>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          invalid={invalid}
          mono
          className={cx(showBrand && css.inputWithBrand, className)}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onPaste={handlePaste}
          onBlur={onBlur}
          {...rest}
        />
        {showBrand ? (
          <span className={css.brand} aria-hidden>
            {CARD_BRAND_LABELS[brand]}
          </span>
        ) : null}
      </div>

      <div className={css.brandsRow} aria-label="Принимаемые карты">
        <span className={css.brandsLabel}>Принимаем:</span>
        {SUPPORTED_CARD_BRANDS.map((id) => (
          <span
            key={id}
            className={css.brandBadge({ active: brand === id && digits.length >= 2 })}
            aria-current={brand === id && digits.length >= 2 ? 'true' : undefined}
          >
            {CARD_BRAND_SHORT_LABELS[id]}
          </span>
        ))}
      </div>
    </div>
  );
});
