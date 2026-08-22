import { useParams } from '@tanstack/react-router';
import { EventParticipantsScreen } from '@/features/events/ui/EventParticipantsScreen';
import { useProfileQuery } from '@/features/profile';

export function EventParticipantsPage() {
  const { groupId: groupIdParam, eventId: eventIdParam } = useParams({
    from: '/app/groups/$groupId/events/$eventId/participants',
  });
  const { data: user } = useProfileQuery();

  return (
    <EventParticipantsScreen
      groupId={Number(groupIdParam)}
      eventId={Number(eventIdParam)}
      currentUserId={user?.id}
    />
  );
}
