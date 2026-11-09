import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowClockwise, Bank, CaretRight, Phone, Users } from '@phosphor-icons/react';
import { useAdminMeQuery } from '@/features/admin';
import { ReceiptPaywallSheet, useCancelSubscription, useSubscriptionQuery } from '@/features/subscription';
import { formatMoney, formatPhone, useRefreshAnimation } from '@/shared/lib';
import { isApiError } from '@/shared/api';
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
  toast,
} from '@/shared/ui';
import { useProfileQuery } from '../api/queries';
import { preferredBankLabel } from '../model/banks';
import { ProfileSkeleton } from './ProfileSkeleton';
import { ProfileFieldEditor } from './ProfileFieldEditor';
import type { RequisitesFocusField } from './RequisitesFields';
import * as css from './ProfileScreen.css';

function formatPeriodEnd(iso: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(iso));
}

export function ProfileScreen() {
  const { data: user, isLoading, isError, refetch, isFetching } = useProfileQuery();
  const subscription = useSubscriptionQuery();
  const cancelSubscription = useCancelSubscription();
  const { refresh, refreshing } = useRefreshAnimation(async () => {
    await Promise.all([refetch(), subscription.refetch()]);
  }, isFetching || subscription.isFetching);
  const [editingField, setEditingField] = useState<RequisitesFocusField | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const navigate = useNavigate();
  const admin = useAdminMeQuery();

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
              <span className={css.sectionLabel}>Подписка</span>
              <Card>
                {admin.data?.admin && !subscription.data?.currentPeriodEnd ? (
                  <Stack gap={3}>
                    <span className={css.subscriptionTitle}>Подписка включена</span>
                    <span className={css.heroMeta}>Чтение фото чека доступно на этом аккаунте</span>
                  </Stack>
                ) : subscription.data?.active && subscription.data.currentPeriodEnd ? (
                  <Stack gap={3}>
                    <span className={css.subscriptionTitle}>
                      До {formatPeriodEnd(subscription.data.currentPeriodEnd)}
                    </span>
                    {subscription.data.provider === 'STARS' && !subscription.data.cancelAtPeriodEnd ? (
                      <Button
                        type="button"
                        variant="secondary"
                        loading={cancelSubscription.isPending}
                        onClick={() =>
                          void cancelSubscription.mutateAsync().catch((error) => {
                            toast.error(
                              isApiError(error)
                                ? error.message
                                : 'Не удалось отменить продление',
                            );
                          })
                        }
                      >
                        Отменить продление
                      </Button>
                    ) : (
                      <span className={css.heroMeta}>
                        {subscription.data.cancelAtPeriodEnd
                          ? 'Продление отменено. Доступ до конца оплаченного периода.'
                          : 'Следующие 30 дней оплачиваются отдельно.'}
                      </span>
                    )}
                  </Stack>
                ) : (
                  <Stack gap={3}>
                    <span className={css.subscriptionTitle}>
                      {formatMoney(subscription.data?.priceKopecks ?? 4900)} за 30 дней
                    </span>
                    <span className={css.heroMeta}>Только для чтения фото чека</span>
                    <Button type="button" fullWidth onClick={() => setPaywallOpen(true)}>
                      Оформить подписку
                    </Button>
                  </Stack>
                )}
              </Card>
            </Stack>
            {admin.data?.admin ? (
              <Stack gap={3}>
                <span className={css.sectionLabel}>Админ</span>
                <Card padding="none">
                  <List>
                    <ListItem
                      leading={<Icon icon={Users} />}
                      title="Люди"
                      subtitle="Кто пользуется и выдача подписки"
                      trailing={<Icon icon={CaretRight} />}
                      onClick={() => void navigate({ to: '/admin' })}
                    />
                  </List>
                </Card>
              </Stack>
            ) : null}
            <ReceiptPaywallSheet
              open={paywallOpen}
              onOpenChange={setPaywallOpen}
              showManual={false}
              onActivated={() => setPaywallOpen(false)}
            />
          </Stack>
        )}
    </Screen>
  );
}
