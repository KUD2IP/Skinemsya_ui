import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { AuthGate } from '@/features/auth';
import { Toaster } from '@/shared/ui';
import { AppShell } from '@/app/layout/AppShell';
import { TabPagerLayout } from '@/app/layout/TabPagerLayout';
import { GroupDetailPage } from '@/app/pages/GroupDetailPage';
import { GroupMembersPage } from '@/app/pages/GroupMembersPage';
import { EventDetailPage } from '@/app/pages/EventDetailPage';
import { EventParticipantsPage } from '@/app/pages/EventParticipantsPage';

const rootRoute = createRootRoute({
  component: function RootLayout() {
    return (
      <AuthGate>
        <Outlet />
        <Toaster />
      </AuthGate>
    );
  },
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppShell,
});

const tabLayoutRoute = createRoute({
  getParentRoute: () => appRoute,
  id: 'tabs',
  component: TabPagerLayout,
});

const groupsRoute = createRoute({
  getParentRoute: () => tabLayoutRoute,
  path: '/',
});

const profileRoute = createRoute({
  getParentRoute: () => tabLayoutRoute,
  path: '/profile',
});

const groupDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/groups/$groupId',
  component: GroupDetailPage,
});

const groupMembersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/groups/$groupId/members',
  component: GroupMembersPage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/groups/$groupId/events/$eventId',
  component: EventDetailPage,
  validateSearch: (search: Record<string, unknown>): { edit?: boolean } => ({
    edit: search.edit === true || search.edit === '1' || search.edit === 'true' ? true : undefined,
  }),
});

const eventParticipantsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/groups/$groupId/events/$eventId/participants',
  component: EventParticipantsPage,
});

const routeTree = rootRoute.addChildren([
  appRoute.addChildren([
    tabLayoutRoute.addChildren([groupsRoute, profileRoute]),
    groupDetailRoute,
    groupMembersRoute,
    eventDetailRoute,
    eventParticipantsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
