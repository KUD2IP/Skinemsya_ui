/** Глубина маршрута в стеке навигации (0 = корень вкладок). */
export function routeDepth(pathname: string): number {
  if (pathname === '/' || pathname === '/groups' || pathname === '/profile') return 0;
  if (pathname.includes('/events/')) return 2;
  if (pathname.startsWith('/groups/')) return 1;
  return 0;
}

/** Направление: 1 = вперёд (push), -1 = назад (pop), иначе вкладки. */
export function routeDirection(from: string, to: string): number {
  const fromDepth = routeDepth(from);
  const toDepth = routeDepth(to);

  if (toDepth > fromDepth) return 1;
  if (toDepth < fromDepth) return -1;

  const fromTab = TAB_ORDER.indexOf(from);
  const toTab = TAB_ORDER.indexOf(to);
  if (fromTab >= 0 && toTab >= 0) return Math.sign(toTab - fromTab);
  return 0;
}

const TAB_ORDER = ['/', '/groups', '/profile'];
export const TAB_PATHS = new Set(TAB_ORDER);
