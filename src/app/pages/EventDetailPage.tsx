import { useParams } from '@tanstack/react-router';
import { EventDetailScreen } from '@/features/events';
import { useProfileQuery } from '@/features/profile';

export function EventDetailPage() {
  const { groupId: groupIdParam, eventId: eventIdParam } = useParams({
    from: '/app/groups/$groupId/events/$eventId',
  });
  const { data: user } = useProfileQuery();

  return (
    <EventDetailScreen
      groupId={Number(groupIdParam)}
      eventId={Number(eventIdParam)}
      currentUserId={user?.id}
    />
  );
}
