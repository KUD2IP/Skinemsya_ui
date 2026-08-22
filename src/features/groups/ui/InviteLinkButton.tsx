import { UserPlus } from '@phosphor-icons/react';
import { openTelegramLink } from '@telegram-apps/sdk-react';
import type { InviteLinkResponse } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Button, Icon, toast } from '@/shared/ui';

interface InviteLinkButtonProps {
  label?: string;
  link?: InviteLinkResponse;
  isLoading?: boolean;
  isError?: boolean;
}

function telegramShareUrl(url: string, text: string): string {
  const params = new URLSearchParams({ url, text });
  return `https://t.me/share/url?${params.toString()}`;
}

async function copyInvite(url: string, text?: string) {
  const payload = text ? `${text}\n${url}` : url;
  await navigator.clipboard.writeText(payload);
}

function tryOpenTelegramShare(shareUrl: string): boolean {
  try {
    if (openTelegramLink.isAvailable()) {
      openTelegramLink(shareUrl);
      return true;
    }
  } catch {
    /* вне Mini App или SDK не готов */
  }
  const opened = window.open(shareUrl, '_blank', 'noopener,noreferrer');
  return opened != null;
}

export function InviteLinkButton({
  label = 'Пригласить',
  link,
  isLoading,
  isError,
}: InviteLinkButtonProps) {
  const share = async () => {
    if (!link?.url) {
      toast.error('Не удалось получить ссылку');
      return;
    }
    const text = link.shareText ?? '';
    const shareUrl = telegramShareUrl(link.url, text);
    try {
      if (tryOpenTelegramShare(shareUrl)) {
        haptics.success();
        return;
      }
      await copyInvite(link.url, text);
      haptics.success();
      toast.success('Ссылка скопирована');
    } catch {
      try {
        await copyInvite(link.url, text);
        haptics.success();
        toast.success('Ссылка скопирована');
      } catch {
        haptics.error();
        toast.error('Не удалось поделиться');
      }
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      leftIcon={<Icon icon={UserPlus} size="sm" />}
      loading={isLoading}
      disabled={isError && !link?.url}
      onClick={() => {
        haptics.tap();
        void share();
      }}
    >
      {label}
    </Button>
  );
}
