import { useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { GroupsScreen } from '@/features/groups';
import { ProfileScreen } from '@/features/profile';
import { TabBar, useAnySheetOpen } from '@/shared/ui';
import { cx, usePrefersReducedMotion, useTransientWillChange } from '@/shared/lib';
import * as css from './TabPagerLayout.css';

const TAB_INDEX: Record<string, number> = {
  '/': 0,
  '/profile': 1,
};

const WILL_CHANGE_MS = 400;

export function TabPagerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const sheetOpen = useAnySheetOpen();
  const reduced = usePrefersReducedMotion();
  const activeIndex = TAB_INDEX[pathname] ?? 0;
  const trackRef = useRef<HTMLDivElement>(null);

  useTransientWillChange(trackRef, activeIndex, WILL_CHANGE_MS);

  return (
    <div className={css.tabShell}>
      <div className={css.tabViewport}>
        <div
          ref={trackRef}
          className={cx(css.tabTrack, reduced && css.tabTrackReduced)}
          style={{ transform: `translate3d(-${activeIndex * 50}%, 0, 0)` }}
        >
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
