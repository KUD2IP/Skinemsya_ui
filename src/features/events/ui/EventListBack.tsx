import { useNavigate } from '@tanstack/react-router';
import { ScreenBack } from '@/shared/ui';

interface EventListBackProps {
  groupId: number;
  oneOff?: boolean;
}

export function EventListBack({ groupId, oneOff = false }: EventListBackProps) {
  const navigate = useNavigate();

  const goBack = () => {
    if (oneOff) {
      void navigate({ to: '/' });
      return;
    }
    void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } });
  };

  return <ScreenBack onBack={goBack} />;
}
