import { useState } from 'react';
import {
  DEFAULT_PHONE_COUNTRY_ID,
  getPhoneCountry,
  maxNationalDigits,
  phoneNationalPlaceholder,
  haptics,
  cx,
} from '@/shared/lib';
import { Input } from '@/shared/ui/Input';
import { CountryPickerSheet } from './CountryPickerSheet';
import * as css from './PhoneInput.css';

export interface PhoneInputProps {
  countryId: string;
  national: string;
  onCountryChange: (countryId: string) => void;
  onNationalChange: (national: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
}

/** Поле телефона: флаг + код страны (sheet с поиском) + национальный номер. */
export function PhoneInput({
  countryId,
  national,
  onCountryChange,
  onNationalChange,
  invalid,
  disabled,
  id,
}: PhoneInputProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const country = getPhoneCountry(countryId);
  const maxLen = maxNationalDigits(country);

  return (
    <>
      <div className={css.row}>
        <button
          type="button"
          className={cx(css.countryButton, invalid && css.countryButtonInvalid)}
          disabled={disabled}
          aria-label={`Код страны: ${country.name}, ${country.dialCode}`}
          onClick={() => {
            haptics.tap();
            setPickerOpen(true);
          }}
        >
          <span className={css.flag} aria-hidden>
            {country.flag}
          </span>
          <span>{country.dialCode}</span>
        </button>

        <Input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className={css.nationalInput}
          placeholder={phoneNationalPlaceholder(country)}
          invalid={invalid}
          disabled={disabled}
          value={national}
          maxLength={maxLen + 4}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, maxLen);
            onNationalChange(digits);
          }}
        />
      </div>

      <CountryPickerSheet
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        selectedId={countryId}
        onSelect={onCountryChange}
      />
    </>
  );
}

export { DEFAULT_PHONE_COUNTRY_ID };
