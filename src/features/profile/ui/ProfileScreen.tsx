import { useState } from 'react';
import {
  ArrowClockwise,
  Bank,
  CaretRight,
  Phone,
  BellSimple,
} from '@phosphor-icons/react';
import { useProfileQuery, useUpdateProfile } from '../api/queries';
import { preferredBankLabel } from '../model/banks';
import { ProfileSkeleton } from './ProfileSkeleton';
import { ProfileFieldEditor } from './ProfileFieldEditor';
import type { RequisitesFocusField } from './RequisitesFields';
import * as css from './ProfileScreen.css';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Icon,
  List,
  ListItem,
  RefreshIconButton,
  Screen,
  Sheet,
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
  const [editingField, setEditingField] = useState<RequisitesFocusField | null>(null);
  const [notificationsInfoOpen, setNotificationsInfoOpen] = useState(false);

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
              </div>
            </Card>

            <Stack gap={3}>
              <span className={css.sectionLabel}>Реквизиты</span>
              <Card padding="none">
                <List>
                  {editingField === 'bank' ? (
                    <ProfileFieldEditor
                      user={user}
                      field="bank"
                      onCancel={() => setEditingField(null)}
                      onSaved={() => setEditingField(null)}
                    />
                  ) : (
                    <ListItem
                      leading={<Icon icon={Bank} />}
                      title="Предпочитаемый банк"
                      subtitle={preferredBankLabel(user.preferredBank) ?? 'Не указан'}
                      trailing={<Icon icon={CaretRight} size="sm" />}
                      onClick={() => setEditingField('bank')}
                    />
                  )}
                  {editingField === 'phone' ? (
                    <ProfileFieldEditor
                      user={user}
                      field="phone"
                      onCancel={() => setEditingField(null)}
                      onSaved={() => setEditingField(null)}
                    />
                  ) : (
                    <ListItem
                      leading={<Icon icon={Phone} />}
                      title="Телефон"
                      subtitle={user.phone ? formatPhone(user.phone) : 'Не указан'}
                      trailing={<Icon icon={CaretRight} size="sm" />}
                      onClick={() => setEditingField('phone')}
                    />
                  )}
                </List>
              </Card>
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
              <p className={css.settingsHint}>
                Личные уведомления о переводах — только после /start в чате с ботом.{' '}
                <button
                  type="button"
                  className={css.settingsHintLink}
                  onClick={() => setNotificationsInfoOpen(true)}
                >
                  Подробнее
                </button>
              </p>
              <Sheet
                open={notificationsInfoOpen}
                onOpenChange={setNotificationsInfoOpen}
                title="Личные уведомления"
              >
                <Stack gap={4}>
                  <p className={css.sheetText}>
                    Без /start в личном чате с ботом не придут:
                  </p>
                  <ul className={css.sheetList}>
                    <li>проверка перевода — плательщику</li>
                    <li>спор по переводу — должнику</li>
                  </ul>
                  <p className={css.sheetText}>
                    В групповом чате всё работает: запуск сбора, напоминания, сообщения о переводах.
                  </p>
                </Stack>
              </Sheet>
            </Stack>
          </Stack>
        )}
    </Screen>
  );
}
