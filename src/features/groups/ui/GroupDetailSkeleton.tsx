import { Skeleton, SkeletonChips, SkeletonList, Stack } from '@/shared/ui';

/** Скелетон экрана группы: действия, участники и сборы. */
export function GroupDetailSkeleton() {
  return (
    <Stack gap={6}>
      <SkeletonChips widths={[132, 108, 112]} />
      <Stack gap={2}>
        <Skeleton width={96} height={12} />
        <SkeletonList rows={1} leading={18} trailing={false} />
      </Stack>
      <Stack gap={3}>
        <Skeleton width={64} height={12} />
        <SkeletonList rows={3} />
      </Stack>
    </Stack>
  );
}
