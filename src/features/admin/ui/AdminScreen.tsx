import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { isApiError } from '@/shared/api';
import type { AdminUserResponse } from '@/shared/api';
import {
  Button,
  EmptyState,
  Input,
  Screen,
  ScreenBack,
  Stack,
  toast,
} from '@/shared/ui';
import { useAdminUsersQuery, useGrantSubscription, useRevokeSubscription } from '../api/queries';
import * as css from './AdminScreen.css';

function formatPeriodEnd(iso: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(iso));
}

function plural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} ${few}`;
  return `${count} ${many}`;
}

function activityLine(user: AdminUserResponse) {
  return `${plural(user.eventsCreated, 'сбор', 'сбора', 'сборов')} · ${plural(user.receiptCount, 'чек', 'чека', 'чеков')}`;
}

export function AdminScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const users = useAdminUsersQuery(query, page);
  const grant = useGrantSubscription();
  const revoke = useRevokeSubscription();
  const busy = grant.isPending || revoke.isPending;
  const pageData = users.data;
  const from = pageData && pageData.total > 0 ? pageData.page * pageData.size + 1 : 0;
  const to = pageData ? Math.min(pageData.total, from + pageData.items.length - 1) : 0;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim().replace(/^@/, ''));
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  return (
    <Screen
      title="Люди"
      headerLeading={<ScreenBack onBack={() => void navigate({ to: '/profile' })} />}
    >
      <Stack gap={3}>
        <Input
          value={search}
          placeholder="Ник в Telegram"
          autoCapitalize="none"
          autoCorrect="off"
          onChange={(event) => setSearch(event.target.value)}
        />
        {users.isLoading && !pageData ? null : users.isError || !pageData ? (
          <EmptyState
            title="Список не открылся"
            description="Проверьте, что этот аккаунт может выдавать подписки."
          />
        ) : pageData.items.length === 0 ? (
          <EmptyState
            title={query ? 'Никого с таким ником' : 'Пока никого нет'}
            description={
              query
                ? 'Поиск идёт по нику Telegram, без символа @.'
                : 'Люди появятся после входа в мини-приложение.'
            }
          />
        ) : (
          <>
            <Stack gap={2}>
              {pageData.items.map((user) => (
                <div key={user.id} className={css.row}>
                  <div className={css.text}>
                    <span className={css.name}>{user.displayName}</span>
                    <span className={css.meta}>
                      {user.telegramUsername ? `@${user.telegramUsername}` : 'Без ника'}
                    </span>
                    <span className={css.meta}>{activityLine(user)}</span>
                    <span className={css.meta}>
                      {user.active && user.currentPeriodEnd
                        ? `Подписка до ${formatPeriodEnd(user.currentPeriodEnd)}`
                        : 'Подписки нет'}
                    </span>
                  </div>
                  <div className={css.actions}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      loading={grant.isPending && grant.variables === user.id}
                      disabled={busy}
                      onClick={() =>
                        void grant.mutateAsync(user.id).then(
                          (updated) => {
                            toast.success(
                              updated.currentPeriodEnd
                                ? `До ${formatPeriodEnd(updated.currentPeriodEnd)}`
                                : 'Подписка выдана',
                            );
                          },
                          (error) => {
                            toast.error(
                              isApiError(error) ? error.message : 'Не удалось выдать подписку',
                            );
                          },
                        )
                      }
                    >
                      30 дней
                    </Button>
                    {user.active ? (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        loading={revoke.isPending && revoke.variables === user.id}
                        disabled={busy}
                        onClick={() =>
                          void revoke.mutateAsync(user.id).then(
                            () => {
                              toast.success('Подписка снята');
                            },
                            (error) => {
                              toast.error(
                                isApiError(error) ? error.message : 'Не удалось снять подписку',
                              );
                            },
                          )
                        }
                      >
                        Снять
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </Stack>
            {pageData.total > pageData.size ? (
              <div className={css.pager}>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={pageData.page === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  Назад
                </Button>
                <span className={css.pagerLabel}>
                  {from}–{to} из {pageData.total}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={to >= pageData.total}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Дальше
                </Button>
              </div>
            ) : null}
          </>
        )}
      </Stack>
    </Screen>
  );
}
