import { UsersThree } from '@phosphor-icons/react';
import type { EventResponse } from '@/shared/api';
import { eventCapacityLabel } from '@/features/events/model/eventRoster';
import * as css from '@/features/events/ui/EventCapacityBar.css';
import { LandingIcon } from './LandingIcon';

interface LandingEventCapacityProps {
  event: EventResponse;
}

/** Статичная копия `EventCapacityBar` для лендинга (без навигации). */
export function LandingEventCapacity({ event }: LandingEventCapacityProps) {
  return (
    <div className={css.panel}>
      <button type="button" className={css.previewRow} tabIndex={-1}>
        <span className={css.previewIcon} aria-hidden>
          <LandingIcon icon={UsersThree} size="sm" />
        </span>
        <span className={css.previewTitle}>Участники</span>
        <span className={css.previewMeta}>{eventCapacityLabel(event)}</span>
      </button>
    </div>
  );
}
