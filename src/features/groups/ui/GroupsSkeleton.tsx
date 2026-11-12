import { Skeleton, SkeletonList, Stack } from '@/shared/ui';

export function GroupsSkeleton() {
  return (
    <Stack gap={4}>
      <Skeleton height={44} radius="lg" />
      <SkeletonList rows={4} />
    </Stack>
  );
}
