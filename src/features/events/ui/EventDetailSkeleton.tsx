import { Skeleton, SkeletonCard, Stack } from '@/shared/ui';

export function EventDetailSkeleton() {
  return (
    <Stack gap={6}>
      <Skeleton height={10} radius="full" />
      <Stack gap={3}>
        <Skeleton width={148} height={12} />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </Stack>
    </Stack>
  );
}
