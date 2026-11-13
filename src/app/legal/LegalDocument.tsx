import type { ReactNode } from 'react';
import { Screen, ScreenBack } from '@/shared/ui';

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
      headerLeading={<ScreenBack onBack={goBack} />}
    >
      {children}
    </Screen>
  );
}
