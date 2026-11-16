import { useState } from 'react';
import { Info, X } from '@phosphor-icons/react';
import { Icon, IconButton } from '@/shared/ui';
import { isContextHintSeen, markContextHintSeen, type ContextHintId } from '../model/onboardingStorage';
import * as css from './ContextHint.css';

interface ContextHintProps {
  id: ContextHintId;
  children: string;
}

export function ContextHint({ id, children }: ContextHintProps) {
  const [visible, setVisible] = useState(() => !isContextHintSeen(id));

  if (!visible) return null;

  const dismiss = () => {
    markContextHintSeen(id);
    setVisible(false);
  };

  return (
    <aside className={css.hint} aria-label="Подсказка">
      <span className={css.icon} aria-hidden>
        <Icon icon={Info} size="sm" />
      </span>
      <p className={css.text}>{children}</p>
      <IconButton variant="bare" aria-label="Скрыть подсказку" onClick={dismiss}>
        <Icon icon={X} size="sm" />
      </IconButton>
    </aside>
  );
}
