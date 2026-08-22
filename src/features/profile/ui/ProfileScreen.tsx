import { useState } from 'react';
import { ArrowClockwise, Bank, CaretRight, Phone } from '@phosphor-icons/react';
import { useProfileQuery } from '../api/queries';
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
  Stack,
} from '@/shared/ui';
import { formatPhone, useRefreshAnimation } from '@/shared/lib';

export function ProfileScreen() {
  const { data: user, isLoading, isError, refetch, isFetching } = useProfileQuery();
  const { refresh, refreshing } = useRefreshAnimation(() => refetch(), isFetching);
  const [editingField, setEditingField] = useState<RequisitesFocusField | null>(null);

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
          </Stack>
        )}
    </Screen>
  );
}
