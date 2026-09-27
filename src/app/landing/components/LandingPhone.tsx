import type { ReactNode } from 'react';
import { DotsThreeVertical, X } from '@phosphor-icons/react';
import { LandingIcon } from './LandingIcon';
import { DINNER } from '../lib/storyData';
import * as css from './LandingPhone.css';

export interface LandingPhoneProps {
  children: ReactNode;
}

function StatusIcons() {
  return (
    <span className={css.statusIcons} aria-hidden>
      <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor">
        <rect x="0" y="7" width="2.4" height="3" rx="0.8" />
        <rect x="4" y="5" width="2.4" height="5" rx="0.8" />
        <rect x="8" y="2.5" width="2.4" height="7.5" rx="0.8" />
        <rect x="12" y="0" width="2.4" height="10" rx="0.8" opacity="0.4" />
      </svg>
      <svg width="13" height="10" viewBox="0 0 13 10" fill="none" stroke="currentColor">
        <path d="M1 3.4a8 8 0 0 1 11 0" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M3.4 6a4.6 4.6 0 0 1 6.2 0" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="6.5" cy="8.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
      <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
        <rect
          x="0.6"
          y="0.6"
          width="18"
          height="9.8"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.5"
        />
        <rect x="2.2" y="2.2" width="13" height="6.6" rx="1.8" fill="currentColor" />
        <path
          d="M20.4 4v3a2 2 0 0 0 0-3Z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
    </span>
  );
}

/** Корпус iPhone: титановая рамка, Dynamic Island, статусбар iOS и шапка Telegram Mini App. */
export function LandingPhone({ children }: LandingPhoneProps) {
  return (
    <div className={css.device} aria-hidden {...{ inert: '' }}>
      <span className={css.btnAction} />
      <span className={css.btnVolumeUp} />
      <span className={css.btnVolumeDown} />
      <span className={css.btnPower} />

      <div className={css.screen}>
        <div className={css.screenHeader}>
          <div className={css.topBand}>
            <span className={css.island}>
              <span className={css.islandLens} />
            </span>
            <div className={css.statusBar}>
              <span className={css.statusTime}>{DINNER.clock}</span>
              <span className={css.statusSpacer} aria-hidden />
              <StatusIcons />
            </div>
          </div>

          <div className={css.chrome}>
            <span className={css.chromeClose}>
              <LandingIcon className={css.chromeIcon} icon={X} size="sm" />
            </span>
            <div className={css.chromeTitles}>
              <span className={css.chromeTitle}>Скинемся</span>
              <span className={css.chromeCaption}>мини-приложение</span>
            </div>
            <span className={css.chromeMore}>
              <LandingIcon className={css.chromeIcon} icon={DotsThreeVertical} size="sm" />
            </span>
          </div>
        </div>

        <div className={css.content}>{children}</div>

        <span className={css.fade} />
        <span className={css.homeBar} />
      </div>
    </div>
  );
}
