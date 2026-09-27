import { PaperPlaneTilt } from '@phosphor-icons/react';
import { getTelegramOpenUrl } from '@/shared/config';
import { Button, Icon } from '@/shared/ui';
import * as css from './LandingCta.css';

export interface LandingCtaProps {
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  showHint?: boolean;
}

export function LandingCta({
  fullWidth,
  size = 'lg',
  compact = false,
  showHint = true,
}: LandingCtaProps) {
  const url = getTelegramOpenUrl();

  const openBot = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const label = compact ? (
    <>
      <span className={css.ctaFull}>Открыть Скинемся</span>
      <span className={css.ctaShort}>Открыть</span>
    </>
  ) : (
    'Открыть Скинемся'
  );

  return (
    <div className={css.root({ compact })}>
      <Button
        variant="primary"
        size={size}
        fullWidth={fullWidth}
        leftIcon={<Icon icon={PaperPlaneTilt} size={size === 'sm' ? 'sm' : 'md'} />}
        disabled={false}
        onClick={openBot}
      >
        {label}
      </Button>
      {showHint ? (
        <p className={css.hint}>
          {url ? 'Mini App в Telegram' : 'Ссылка на бота настраивается администратором'}
        </p>
      ) : null}
    </div>
  );
}
