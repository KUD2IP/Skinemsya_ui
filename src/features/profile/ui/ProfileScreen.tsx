import { useState } from 'react';
import {
  ArrowClockwise,
  Bank,
  CreditCard,
  PencilSimple,
  Phone,
  BellSimple,
} from '@phosphor-icons/react';
import { useProfileQuery, useUpdateProfile } from '../api/queries';
import { preferredBankLabel } from '../model/banks';
import { ProfileSkeleton } from './ProfileSkeleton';
import { EditProfileSheet } from './EditProfileSheet';
import * as css from './ProfileScreen.css';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  List,
  ListItem,
  RefreshIconButton,
  Screen,
  Stack,
  Switch,
  toast,
} from '@/shared/ui';
import { formatPhone, useRefreshAnimation } from '@/shared/lib';

function readPushEnabled(settings: string | null): boolean {
  if (!settings) return false;
  try {
    return Boolean((JSON.parse(settings) as { push?: boolean }).push);
  } catch {
    return false;
  }
}

export function ProfileScreen() {
  const { data: user, isLoading, isError, refetch, isFetching } = useProfileQuery();
  const { refresh, refreshing } = useRefreshAnimation(() => refetch(), isFetching);
  const update = useUpdateProfile();
  const [editing, setEditing] = useState(false);

  return (
    <Screen
      title="Профиль"
      refreshing={refreshing && !isLoading}
      headerAction={
        <RefreshIconButton refreshing={refreshing} onRefresh={() => void refresh()} />
      }
    >
      {isLoading ? (
          <ProfileSkeleton />
        ) : isError || !user ? (
          <EmptyState
            icon={<Icon icon={ArrowClockwise} size="lg" />}
            title="Не удалось загрузить профиль"
            description="Проверьте соединение и попробуйте снова."
            actions={
              <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
                Повторить
              </Button>
            }
          />
        ) : (
          <Stack gap={6}>
            <Card variant="hero" padding="lg">
              <div className={css.heroRow}>
                <Avatar size="lg" name={user.displayName} />
                <Stack gap={1} flex={1}>
                  <span className={css.heroName}>{user.displayName}</span>
                  <span className={css.heroMeta}>Telegram ID: {user.telegramUserId}</span>
                </Stack>
                <Badge tone="brand">Активен</Badge>
              </div>
            </Card>

            <Stack gap={3}>
              <span className={css.sectionLabel}>Реквизиты</span>
              <List>
                <ListItem
                  leading={<Icon icon={CreditCard} />}
                  title="Для перевода"
                  subtitle={
                    user.paymentDetails ?? 'Не указаны — добавьте, чтобы вам могли скинуться'
                  }
                />
                <ListItem
                  leading={<Icon icon={Bank} />}
                  title="Предпочитаемый банк"
                  subtitle={preferredBankLabel(user.preferredBank) ?? 'Не указан'}
                />
                <ListItem
                  leading={<Icon icon={Phone} />}
                  title="Телефон"
                  subtitle={user.phone ? formatPhone(user.phone) : 'Не указан'}
                />
              </List>
            </Stack>

            <Stack gap={3}>
              <span className={css.sectionLabel}>Настройки</span>
              <Card padding="sm">
                <Stack direction="row" align="center" gap={4}>
                  <Icon icon={BellSimple} />
                  <Stack gap={0} flex={1}>
                    <span>Уведомления</span>
                  </Stack>
                  <Switch
                    checked={readPushEnabled(user.notificationSettings)}
                    disabled={refreshing || update.isPending}
                    onChange={(next) => {
                      update.mutate(
                        {
                          paymentDetails: user.paymentDetails ?? undefined,
                          phone: user.phone ?? undefined,
                          preferredBank: user.preferredBank ?? undefined,
                          notificationSettings: JSON.stringify({ push: next }),
                        },
                        {
                          onSuccess: () => toast.saved('Настройки сохранены'),
                          onError: () => toast.error('Не удалось сохранить'),
                        },
                      );
                    }}
                  />
                </Stack>
              </Card>
            </Stack>

            <Button
              fullWidth
              size="lg"
              leftIcon={<Icon icon={PencilSimple} size="sm" />}
              onClick={() => setEditing(true)}
            >
              Редактировать профиль
            </Button>

            <EditProfileSheet open={editing} onOpenChange={setEditing} user={user} />
          </Stack>
        )}
    </Screen>
  );
}
