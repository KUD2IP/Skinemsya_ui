import { useId } from 'react';
import { LOGO_PATHS } from './logoPaths';
import * as css from './BrandLogo.css';
import { vars } from '@/shared/theme';
import { cx } from '@/shared/lib';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

/** Статичный логотип «S» с галочкой — геометрия из public/logo.svg. */
export function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  const uid = useId().replace(/:/g, '');
  const gradId = `brand-logo-grad-${uid}`;

  return (
    <div className={cx(css.root({ size }), className)} aria-hidden>
      <svg className={css.svg({ size })} viewBox="235 155 555 720" role="img" aria-label="Скинемся">
        <defs>
          <linearGradient
            id={gradId}
            x1="250"
            y1="170"
            x2="780"
            y2="850"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={vars.color.green[300]} />
            <stop offset="0.48" stopColor={vars.color.accent} />
            <stop offset="1" stopColor={vars.color.green[600]} />
          </linearGradient>
        </defs>
        {LOGO_PATHS.map((d, i) => (
          <path key={i} d={d} fill={`url(#${gradId})`} />
        ))}
      </svg>
    </div>
  );
}
