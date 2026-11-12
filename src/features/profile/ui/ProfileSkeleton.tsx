import { Card, Skeleton, SkeletonCard, SkeletonList, Stack } from '@/shared/ui';

/** Скелетон экрана профиля: карточка, реквизиты и подписка. */
export function ProfileSkeleton() {
  return (
    <Stack gap={6}>
      <Card variant="hero" padding="lg">
        <Stack direction="row" gap={5} align="center">
          <Skeleton circle width={64} height={64} />
          <Stack gap={3} flex={1}>
            <Skeleton width="58%" height={22} />
            <Skeleton width="42%" height={14} />
          </Stack>
        </Stack>
      </Card>

      <Stack gap={3}>
        <Skeleton width={88} height={12} />
        <SkeletonList rows={2} trailing={false} />
      </Stack>

      <Stack gap={3}>
        <Skeleton width={72} height={12} />
        <SkeletonCard lines={2} action />
      </Stack>
    </Stack>
  );
}
