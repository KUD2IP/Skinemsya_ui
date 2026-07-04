import type { ReactNode } from 'react';
import { ChatsTeardrop, UsersThree } from '@phosphor-icons/react';
import type { GroupResponse } from '@/shared/api';
import { Icon } from '@/shared/ui';
import { formatRelativeTimeShort, haptics } from '@/shared/lib';
import * as css from './GroupListCard.css';

interface GroupListCardProps {
  group: GroupResponse;
  onClick: () => void;
}

export function GroupListCard({ group, onClick }: GroupListCardProps) {
  const handleClick = () => {
    haptics.tap();
    onClick();
  };

  const isChat = group.type === 'CHAT_LINKED';

  return (
    <button type="button" className={css.row} onClick={handleClick}>
      <span className={css.iconLeading} aria-hidden>
        <Icon icon={isChat ? ChatsTeardrop : UsersThree} size="md" />
      </span>
      <span className={css.rowBody}>
        <span className={css.nameBlock}>
          <span className={css.title}>{group.name}</span>
          <span className={css.subtitle}>
            {isChat ? 'Из Telegram-чата' : 'Своя группа'}
          </span>
        </span>
        <span className={css.time}>{formatRelativeTimeShort(group.updatedAt)}</span>
      </span>
    </button>
  );
}

/** Обёртка списка групп в одной поверхности. */
export function GroupListPanel({ children }: { children: ReactNode }) {
  return <div className={css.listPanel}>{children}</div>;
}
