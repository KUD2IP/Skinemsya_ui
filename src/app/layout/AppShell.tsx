import { useEffect, useRef } from 'react';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { ChatBootstrapHandler } from '@/features/auth';
import { resetOverlayState } from '@/shared/ui/Sheet/sheet.store';
import { TAB_PATHS } from './routeMotion';
import * as css from './AppShell.css';

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isTabRoute = TAB_PATHS.has(pathname);
  const prevPath = useRef(pathname);

  useEffect(() => {
    prevPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = '';
    resetOverlayState();
  }, [pathname]);

  return (
    <>
      <ChatBootstrapHandler />
      <div className={css.shell}>
      {isTabRoute ? (
        <Outlet />
      ) : (
        <div className={css.stackShell}>
          <div className={css.routeViewport}>
            <div className={css.routePage}>
              <Outlet />
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
