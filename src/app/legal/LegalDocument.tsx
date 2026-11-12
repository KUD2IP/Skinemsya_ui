import type { ReactNode } from 'react';
import { CaretLeft } from '@phosphor-icons/react';
import { Icon, IconButton, Screen } from '@/shared/ui';

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.assign('/');
}

export function LegalDocument({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Screen
      title={title}
      headerLeading={
        <IconButton aria-label="Назад" onClick={goBack}>
          <Icon icon={CaretLeft} weight="bold" />
        </IconButton>
      }
    >
      {children}
    </Screen>
  );
}
