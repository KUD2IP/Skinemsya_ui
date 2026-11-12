import { Link } from '@tanstack/react-router';
import { CaretRight, Gavel, Megaphone, ShieldCheck } from '@phosphor-icons/react';
import { openTelegramLink } from '@telegram-apps/sdk-react';
import { TELEGRAM_CHANNEL_URL, getTelegramChannelHandle } from '@/shared/config';
import { haptics } from '@/shared/lib';
import { Icon, Stack } from '@/shared/ui';
import * as css from './ProfileScreen.css';

const CHANNEL_HANDLE = getTelegramChannelHandle(TELEGRAM_CHANNEL_URL) ?? '@skinemsya_vse';

function openChannel() {
  haptics.tap();
  if (openTelegramLink.isAvailable()) {
    openTelegramLink(TELEGRAM_CHANNEL_URL);
    return;
  }
  window.open(TELEGRAM_CHANNEL_URL, '_blank', 'noopener,noreferrer');
}

export function ProfileLinks() {
  return (
    <>
      <Stack gap={3}>
        <h2 className={css.blockTitle}>Юридические документы</h2>
        <div className={css.linkStack}>
          <Link to="/legal/offer" className={css.linkCard} onClick={() => haptics.tap()}>
            <span className={css.linkIcon}>
              <Icon icon={Gavel} />
            </span>
            <span className={css.linkBody}>
              <span className={css.linkTitle}>Договор оферты</span>
              <span className={css.linkSubtitle}>Условия подписки</span>
            </span>
            <span className={css.linkChevron}>
              <Icon icon={CaretRight} size="sm" />
            </span>
          </Link>
          <Link to="/legal/privacy" className={css.linkCard} onClick={() => haptics.tap()}>
            <span className={css.linkIcon}>
              <Icon icon={ShieldCheck} />
            </span>
            <span className={css.linkBody}>
              <span className={css.linkTitle}>Политика конфиденциальности</span>
              <span className={css.linkSubtitle}>Какие данные хранятся</span>
            </span>
            <span className={css.linkChevron}>
              <Icon icon={CaretRight} size="sm" />
            </span>
          </Link>
        </div>
      </Stack>

      <Stack gap={3}>
        <h2 className={css.blockTitle}>Каналы</h2>
        <button type="button" className={css.linkCard} onClick={openChannel}>
          <span className={css.linkIcon}>
            <Icon icon={Megaphone} />
          </span>
          <span className={css.linkBody}>
            <span className={css.linkTitle}>Новости</span>
            <span className={css.linkSubtitle}>{CHANNEL_HANDLE}</span>
          </span>
          <span className={css.linkChevron}>
            <Icon icon={CaretRight} size="sm" />
          </span>
        </button>
      </Stack>
    </>
  );
}
