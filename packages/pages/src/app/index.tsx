import React, { StrictMode } from 'react';
// This is needed for testing React 16 and 17.
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';

import App from './App.tsx';
import AppProvider from './data/AppProvider.tsx';

const rootElement = document.getElementById('root');

// rootElement && createRoot(rootElement).render(<App />);

render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
  rootElement
);

declare const IS_DEVELOPMENT: true | undefined;

if (IS_DEVELOPMENT) {
  new EventSource('/esbuild').addEventListener('change', () => location.reload());
}
