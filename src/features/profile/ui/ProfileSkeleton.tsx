import { Card, Skeleton, Stack } from '@/shared/ui';

/** Скелетон экрана профиля, повторяющий реальную раскладку. */
export function ProfileSkeleton() {
  return (
    <Stack gap={6}>
      <Card variant="hero" padding="lg">
        <Stack direction="row" gap={5} align="center">
          <Skeleton circle width={64} height={64} />
          <Stack gap={3} flex={1}>
            <Skeleton width="60%" height={22} />
            <Skeleton width="40%" height={14} />
          </Stack>
        </Stack>
      </Card>

      <Stack gap={3}>
        <Skeleton width={140} height={14} />
        <Card padding="none">
          <Stack gap={2} style={{ padding: 8 }}>
            <Skeleton height={48} />
            <Skeleton height={48} />
          </Stack>
        </Card>
      </Stack>

      <Skeleton height={52} radius="lg" />
    </Stack>
  );
}
