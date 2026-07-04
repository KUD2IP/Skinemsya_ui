import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useEventQuery } from '@/features/events/api/queries';
import { resolveEventIdFromTelegram } from '../lib/initData';
import { useSessionStore } from '../model/session.store';

/** Обрабатывает chatBootstrap и deep link event_{id} после авторизации. */
export function ChatBootstrapHandler() {
  const navigate = useNavigate();
  const consumeChatBootstrap = useSessionStore((s) => s.consumeChatBootstrap);
  const consumePendingEventNavigation = useSessionStore((s) => s.consumePendingEventNavigation);
  const handled = useRef(false);

  const initEventId = resolveEventIdFromTelegram();
  const { data: deepLinkEvent, isLoading: deepLinkLoading } = useEventQuery(initEventId ?? 0);

  useEffect(() => {
    if (handled.current) return;

    const bootstrap = consumeChatBootstrap();
    if (bootstrap) {
      handled.current = true;
      if (bootstrap.eventId != null) {
        void navigate({
          to: '/groups/$groupId/events/$eventId',
          params: {
            groupId: String(bootstrap.groupId),
            eventId: String(bootstrap.eventId),
          },
        });
      } else {
        void navigate({ to: '/groups/$groupId', params: { groupId: String(bootstrap.groupId) } });
      }
      return;
    }

    const pendingNav = consumePendingEventNavigation();
    if (pendingNav) {
      handled.current = true;
      void navigate({
        to: '/groups/$groupId/events/$eventId',
        params: {
          groupId: String(pendingNav.groupId),
          eventId: String(pendingNav.eventId),
        },
      });
      return;
    }

    if (initEventId != null) {
      if (deepLinkLoading) return;
      if (deepLinkEvent) {
        handled.current = true;
        void navigate({
          to: '/groups/$groupId/events/$eventId',
          params: {
            groupId: String(deepLinkEvent.groupId),
            eventId: String(initEventId),
          },
        });
      } else if (!deepLinkLoading) {
        handled.current = true;
      }
    }
  }, [
    consumeChatBootstrap,
    consumePendingEventNavigation,
    deepLinkEvent,
    deepLinkLoading,
    initEventId,
    navigate,
  ]);

  return null;
}
