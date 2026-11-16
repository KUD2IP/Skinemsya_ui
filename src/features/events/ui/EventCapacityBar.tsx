import { useNavigate } from '@tanstack/react-router';
import { UsersThree } from '@phosphor-icons/react';
import { InviteLinkButton } from '@/features/groups/ui/InviteLinkButton';
import type { EventResponse } from '@/shared/api';
import { cx, haptics } from '@/shared/lib';
import { Icon } from '@/shared/ui';
import { useEventInviteLinkQuery } from '../api/queries';
import { eventCapacityLabel } from '../model/eventRoster';
import * as css from './EventCapacityBar.css';

interface EventCapacityBarProps {
  event: EventResponse;
  currentUserId?: number;
}

export function EventCapacityBar({ event }: EventCapacityBarProps) {
  const navigate = useNavigate();
  const showInvite = event.oneOff && event.status !== 'COMPLETED';
  const inviteLink = useEventInviteLinkQuery(event.id, showInvite);

  const participants = (
    <div className={cx(css.panel, showInvite && css.panelGrow)}>
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

  if (!showInvite) return participants;

  return (
    <div className={css.withInvite}>
      {participants}
      <InviteLinkButton
        className={css.inviteButton}
        link={inviteLink.data}
        isLoading={inviteLink.isLoading}
        isError={inviteLink.isError}
      />
    </div>
  );
}
