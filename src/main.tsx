import '@fontsource-variable/onest';
import '@fontsource-variable/jetbrains-mono';
import '@/shared/theme/global.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { initTelegram } from './app/providers/telegram';

void initTelegram();

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
