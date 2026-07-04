import { Skeleton, Stack } from '@/shared/ui';
import * as css from './GroupListCard.css';

export function GroupsSkeleton() {
  return (
    <Stack gap={4}>
      <Skeleton height={44} radius="lg" />
      <Skeleton className={css.panelSkeleton} />
    </Stack>
  );
}
