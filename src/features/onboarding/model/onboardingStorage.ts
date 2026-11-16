export type ContextHintId = 'positions' | 'selection';

const STORAGE_PREFIX = 'skinemsya.onboarding.hint.';

export function isContextHintSeen(id: ContextHintId): boolean {
  try {
    return window.localStorage.getItem(`${STORAGE_PREFIX}${id}`) === 'seen';
  } catch {
    return false;
  }
}

export function markContextHintSeen(id: ContextHintId): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${id}`, 'seen');
  } catch {
    return;
  }
}
