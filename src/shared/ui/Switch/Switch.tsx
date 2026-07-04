import { Switch as ArkSwitch } from '@ark-ui/react/switch';
import type { ReactNode } from 'react';
import * as css from './Switch.css';
import { haptics } from '@/shared/lib';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

export function Switch({ checked, defaultChecked, onChange, disabled, children }: SwitchProps) {
  return (
    <ArkSwitch.Root
      className={css.root}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onCheckedChange={(details) => {
        haptics.select();
        onChange?.(details.checked);
      }}
    >
      <ArkSwitch.Control className={css.control}>
        <ArkSwitch.Thumb className={css.thumb} />
      </ArkSwitch.Control>
      {children != null && <ArkSwitch.Label className={css.label}>{children}</ArkSwitch.Label>}
      <ArkSwitch.HiddenInput />
    </ArkSwitch.Root>
  );
}
