import { useId } from 'react';
import { LOGO_PATHS } from '@/shared/ui/BrandLogo/logoPaths';
import { vars } from '@/shared/theme';
import * as css from './LandingMark.css';

/** Компактная иконка бренда для шапки лендинга (24px, без glow). */
export function LandingMark() {
  const uid = useId().replace(/:/g, '');
  const gradId = `landing-mark-grad-${uid}`;

  return (
    <svg className={css.mark} viewBox="235 155 555 720" role="img" aria-label="Скинемся">
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
  );
}
