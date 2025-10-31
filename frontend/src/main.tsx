import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppProviders from '@/providers/AppProviders';
import App from '@/app/App';
import '@/styles/index.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
