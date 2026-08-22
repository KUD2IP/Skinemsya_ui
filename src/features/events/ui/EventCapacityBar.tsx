import { useNavigate } from '@tanstack/react-router';
import { UsersThree } from '@phosphor-icons/react';
import type { EventResponse } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Icon } from '@/shared/ui';
import { eventCapacityLabel } from '../model/eventRoster';
import * as css from './EventCapacityBar.css';

interface EventCapacityBarProps {
  event: EventResponse;
  currentUserId?: number;
}

export function EventCapacityBar({ event }: EventCapacityBarProps) {
  const navigate = useNavigate();

  return (
    <div className={css.panel}>
      <button
        type="button"
        className={css.previewRow}
        onClick={() => {
          haptics.tap();
          void navigate({
            to: '/groups/$groupId/events/$eventId/participants',
            params: { groupId: String(event.groupId), eventId: String(event.id) },
          });
        }}
      >
        <span className={css.previewIcon} aria-hidden>
          <Icon icon={UsersThree} size="sm" />
        </span>
        <span className={css.previewTitle}>Участники</span>
        <span className={css.previewMeta}>{eventCapacityLabel(event)}</span>
      </button>
    </div>
  );
}
