import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useSessionStore } from '@/features/auth';
import { GroupDetailScreen } from '@/features/groups';
import { CreateEventSheet, GroupEventsSection } from '@/features/events';

export function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId: groupIdParam } = useParams({ from: '/app/groups/$groupId' });
  const consumePendingCreateEventGroupId = useSessionStore(
    (s) => s.consumePendingCreateEventGroupId,
  );
  const groupId = Number(groupIdParam);
  const [creatingEvent, setCreatingEvent] = useState(false);

  useEffect(() => {
    const pendingGroupId = consumePendingCreateEventGroupId();
    if (pendingGroupId === groupId) {
      setCreatingEvent(true);
    }
  }, [consumePendingCreateEventGroupId, groupId]);

  return (
    <>
      <GroupDetailScreen
        groupId={groupId}
        onCreateEvent={() => setCreatingEvent(true)}
        eventsSection={
          <GroupEventsSection groupId={groupId} onCreateEvent={() => setCreatingEvent(true)} />
        }
      />
      <CreateEventSheet
        open={creatingEvent}
        onOpenChange={setCreatingEvent}
        groupId={groupId}
        onCreated={(eventId) => {
          void navigate({
            to: '/groups/$groupId/events/$eventId',
            params: { groupId: String(groupId), eventId: String(eventId) },
          });
        }}
      />
    </>
  );
}
