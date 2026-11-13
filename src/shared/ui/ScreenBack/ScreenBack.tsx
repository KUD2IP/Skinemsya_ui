import { CaretLeft } from '@phosphor-icons/react';
import { useTelegramBack } from '@/shared/lib/telegramBack';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';

interface ScreenBackProps {
  onBack: () => void;
}

/** Системная стрелка Telegram. Вне Telegram — кнопка в шапке страницы. */
export function ScreenBack({ onBack }: ScreenBackProps) {
  const native = useTelegramBack(onBack);
  if (native) return null;
  return (
    <IconButton aria-label="Назад" onClick={onBack}>
      <Icon icon={CaretLeft} weight="bold" />
    </IconButton>
  );
}
