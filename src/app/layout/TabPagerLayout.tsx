import { useRouterState } from '@tanstack/react-router';
import { OneOffEventsScreen } from '@/features/events';
import { GroupsScreen } from '@/features/groups';
import { ProfileScreen } from '@/features/profile';
import { TabBar, useAnySheetOpen } from '@/shared/ui';
import * as css from './TabPagerLayout.css';

const TAB_INDEX: Record<string, number> = {
  '/': 0,
  '/groups': 1,
  '/profile': 2,
};

export function TabPagerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sheetOpen = useAnySheetOpen();
  const activeIndex = TAB_INDEX[pathname] ?? 0;

  return (
    <div className={css.tabShell} data-tab-shell>
      <div className={css.tabViewport}>
        <div className={css.tabTrack}>
          <div
            className={css.tabPage({ active: activeIndex === 0 })}
            aria-hidden={activeIndex !== 0}
          >
            <OneOffEventsScreen />
          </div>
          <div
            className={css.tabPage({ active: activeIndex === 1 })}
            aria-hidden={activeIndex !== 1}
          >
            <GroupsScreen />
          </div>
          <div
            className={css.tabPage({ active: activeIndex === 2 })}
            aria-hidden={activeIndex !== 2}
          >
            <ProfileScreen />
          </div>
        </div>
      </div>
      <TabBar hidden={sheetOpen} activeIndex={activeIndex} />
    </div>
  );
}
