import { Link, useRouterState } from '@tanstack/react-router';
import { UsersThree, UserCircle } from '@phosphor-icons/react';
import { Icon } from '@/shared/ui/Icon';
import { haptics } from '@/shared/lib';
import * as css from './TabBar.css';

const tabs = [
  { to: '/', label: 'Группы', icon: UsersThree },
  { to: '/profile', label: 'Профиль', icon: UserCircle },
] as const;

export interface TabBarProps {
  /** Скрыть панель, когда открыта шторка (без размонтирования). */
  hidden?: boolean;
  /** Индекс активной вкладки для синхронизации анимации индикатора. */
  activeIndex?: number;
}

export function TabBar({ hidden = false, activeIndex }: TabBarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const resolvedIndex =
    activeIndex ??
    (pathname.startsWith('/profile') ? 1 : 0);

  return (
    <nav
      className={css.bar({ hidden })}
      aria-label="Основная навигация"
      aria-hidden={hidden || undefined}
    >
      <div className={css.inner}>
        <div
          className={css.tabIndicator}
          aria-hidden
          style={{
            transform: `translateX(calc(${resolvedIndex} * (100% + var(--tab-gap))))`,
          }}
        />
        {tabs.map((tab, index) => {
          const active = resolvedIndex === index;

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={css.tabLink}
              aria-current={active ? 'page' : undefined}
              tabIndex={hidden ? -1 : undefined}
              onClick={() => haptics.tap()}
            >
              <span className={css.tabContent({ active })}>
                <span className={css.tabIcon({ active })}>
                  <Icon icon={tab.icon} size="sm" />
                </span>
                <span className={css.tabLabel({ active })}>{tab.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
