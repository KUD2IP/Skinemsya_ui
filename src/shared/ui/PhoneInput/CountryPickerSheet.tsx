import { useMemo, useState } from 'react';
import type { PhoneCountry } from '@/shared/lib/phoneCountries';
import { searchPhoneCountries, haptics } from '@/shared/lib';
import { Input } from '@/shared/ui/Input';
import { Sheet } from '@/shared/ui/Sheet';
import * as css from './PhoneInput.css';

export interface CountryPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: string;
  onSelect: (countryId: string) => void;
}

export function CountryPickerSheet({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: CountryPickerSheetProps) {
  const [query, setQuery] = useState('');

  const countries = useMemo(() => searchPhoneCountries(query), [query]);

  const handleSelect = (country: PhoneCountry) => {
    haptics.select();
    onSelect(country.id);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Sheet
      nested
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery('');
      }}
      title="Код страны"
      description="Выберите страну или найдите по названию / коду."
    >
      <Input
        className={css.search}
        placeholder="Поиск: Россия, +49, DE…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      <div className={css.countryList} role="listbox" aria-label="Страны">
        {countries.map((country) => (
          <button
            key={country.id}
            type="button"
            role="option"
            aria-selected={country.id === selectedId}
            data-selected={country.id === selectedId ? 'true' : 'false'}
            className={css.countryOption}
            onClick={() => handleSelect(country)}
          >
            <span className={css.flag} aria-hidden>
              {country.flag}
            </span>
            <span className={css.countryName}>{country.name}</span>
            <span className={css.countryDial}>{country.dialCode}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
