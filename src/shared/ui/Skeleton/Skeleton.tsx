import type { CSSProperties } from 'react';
import { skeleton, list, row, lines, chips, card } from './Skeleton.css';
import { cx } from '@/shared/lib';
import { vars } from '@/shared/theme';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: keyof typeof vars.radius;
  circle?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width, height = 16, radius, circle, className, style }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cx(skeleton, className)}
      style={{
        width,
        height,
        borderRadius: circle ? vars.radius.full : radius ? vars.radius[radius] : undefined,
        ...style,
      }}
    />
  );
}

export interface SkeletonListProps {
  rows?: number;
  /** Кружок слева: иконка или аватар. */
  leading?: number | false;
  trailing?: boolean;
}

/** Панель строк: кружок, две линии текста и короткая метка справа. */
export function SkeletonList({ rows = 3, leading = 22, trailing = true }: SkeletonListProps) {
  return (
    <div className={list} aria-hidden>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={row}>
          {leading !== false ? <Skeleton circle width={leading} height={leading} /> : null}
          <div className={lines}>
            <Skeleton width={index % 2 === 0 ? '64%' : '48%'} height={14} />
            <Skeleton width={index % 2 === 0 ? '40%' : '32%'} height={12} />
          </div>
          {trailing ? <Skeleton width={36} height={12} /> : null}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChips({ widths = [112, 96] }: { widths?: number[] }) {
  return (
    <div className={chips} aria-hidden>
      {widths.map((width, index) => (
        <Skeleton key={`${width}-${index}`} width={width} height={36} radius="lg" />
      ))}
    </div>
  );
}

export function SkeletonCard({ lines: lineCount = 2, action = false }: { lines?: number; action?: boolean }) {
  return (
    <div className={card} aria-hidden>
      {Array.from({ length: lineCount }, (_, index) => (
        <Skeleton key={index} width={index === 0 ? '46%' : '72%'} height={index === 0 ? 18 : 14} />
      ))}
      {action ? <Skeleton height={44} radius="lg" /> : null}
    </div>
  );
}
