import { useState } from 'react';
import { avatar, type AvatarVariants } from './Avatar.css';
import { cx, initials } from '@/shared/lib';

export interface AvatarProps extends AvatarVariants {
  src?: string | null;
  name?: string | null;
  className?: string;
}

export function Avatar({ src, name, size, tone, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return showImage ? (
    <img
      className={cx(avatar({ size, tone }), className)}
      src={src}
      alt={name ?? ''}
      onError={() => setFailed(true)}
    />
  ) : (
    <span className={cx(avatar({ size, tone }), className)} aria-label={name ?? undefined}>
      {initials(name)}
    </span>
  );
}
