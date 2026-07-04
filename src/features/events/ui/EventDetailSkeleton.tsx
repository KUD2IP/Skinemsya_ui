import { Skeleton } from '@/shared/ui';
import * as css from './EventDetailScreen.css';

export function EventDetailSkeleton() {
  return (
    <div className={css.stack}>
      <Skeleton className={css.block} />
      <Skeleton className={css.row} />
      <Skeleton className={css.row} />
    </div>
  );
}
