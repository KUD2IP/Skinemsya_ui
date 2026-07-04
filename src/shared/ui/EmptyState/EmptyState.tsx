import type { ReactNode } from 'react';
import * as css from './EmptyState.css';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
  return (
    <div className={css.root}>
      {icon != null && <div className={css.iconWrap}>{icon}</div>}
      <div className={css.title}>{title}</div>
      {description != null && <div className={css.description}>{description}</div>}
      {actions != null && <div className={css.actions}>{actions}</div>}
    </div>
  );
}
