import { useRouterState } from '@tanstack/react-router';
import { GroupsScreen } from '@/features/groups';
import { ProfileScreen } from '@/features/profile';
import { TabBar, useAnySheetOpen } from '@/shared/ui';
import * as css from './TabPagerLayout.css';

const TAB_INDEX: Record<string, number> = {
  '/': 0,
  '/profile': 1,
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
            <GroupsScreen />
          </div>
          <div
            className={css.tabPage({ active: activeIndex === 1 })}
            aria-hidden={activeIndex !== 1}
          >
            <ProfileScreen />
          </div>
        </div>
      </div>
      <TabBar hidden={sheetOpen} activeIndex={activeIndex} />
    </div>
  );
}
