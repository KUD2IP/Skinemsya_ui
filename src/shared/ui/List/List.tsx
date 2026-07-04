import type { HTMLAttributes, ReactNode } from 'react';
import * as css from './List.css';
import { cx, haptics } from '@/shared/lib';

export interface ListProps extends HTMLAttributes<HTMLDivElement> {}

export function List({ className, children, ...rest }: ListProps) {
  return (
    <div className={cx(css.list, className)} role="list" {...rest}>
      {children}
    </div>
  );
}

export interface ListItemProps {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  className,
}: ListItemProps) {
  const interactive = Boolean(onClick);
  const handleActivate = () => {
    if (!onClick) return;
    haptics.tap();
    onClick();
  };

  return (
    <div
      role="listitem"
      className={cx(css.item, interactive && css.itemInteractive, className)}
      onClick={handleActivate}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleActivate();
              }
            }
          : undefined
      }
      tabIndex={interactive ? 0 : undefined}
    >
      {leading != null && <span className={css.leading}>{leading}</span>}
      <span className={css.body}>
        <span className={css.title}>{title}</span>
        {subtitle != null && <span className={css.subtitle}>{subtitle}</span>}
      </span>
      {trailing != null && <span className={css.trailing}>{trailing}</span>}
    </div>
  );
}
