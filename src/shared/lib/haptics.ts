import {
  hapticFeedbackImpactOccurred,
  hapticFeedbackNotificationOccurred,
  hapticFeedbackSelectionChanged,
  isHapticFeedbackSupported,
} from '@telegram-apps/sdk-react';

/**
 * Безопасная обёртка над тактильной отдачей Telegram.
 * Вне Telegram / при отсутствии поддержки — тихий no-op.
 */
function safe(run: () => void) {
  try {
    if (isHapticFeedbackSupported()) run();
  } catch {
    /* no-op вне Telegram */
  }
}

export const haptics = {
  tap: () => safe(() => hapticFeedbackImpactOccurred('light')),
  press: () => safe(() => hapticFeedbackImpactOccurred('medium')),
  success: () => safe(() => hapticFeedbackNotificationOccurred('success')),
  error: () => safe(() => hapticFeedbackNotificationOccurred('error')),
  select: () => safe(() => hapticFeedbackSelectionChanged()),
};
