const USERNAME_PATTERN = /^@?[a-zA-Z0-9_]{5,32}$/;

/** Нормализует @username для API (без @, lowercase). */
export function normalizeTelegramUsername(raw: string): string {
  const trimmed = raw.trim();
  const withoutAt = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  return withoutAt.toLowerCase();
}

export function isValidTelegramUsername(raw: string): boolean {
  return USERNAME_PATTERN.test(raw.trim());
}

export function formatTelegramUsername(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return `@${normalizeTelegramUsername(raw)}`;
}

export function memberDisplayLabel(
  displayName: string,
  telegramUsername: string | null,
): string {
  const handle = formatTelegramUsername(telegramUsername);
  return handle ?? displayName;
}
