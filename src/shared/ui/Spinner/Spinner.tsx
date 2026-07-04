import { spinner } from './Spinner.css';
import { cx } from '@/shared/lib';

export interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className }: SpinnerProps) {
  return (
    <span
      className={cx(spinner, className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Загрузка"
    />
  );
}
