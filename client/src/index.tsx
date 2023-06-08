import React from 'react';
import { createRoot } from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import './index.css';
import { App } from './app/App';
import { RootStoreContext } from './app/context/rootStoreContext';
import RootStore from './app/store/rootStore';
import { QueryClient, QueryClientProvider } from 'react-query';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
const client = new QueryClient();
root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={new RootStore()}>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </RootStoreContext.Provider>
  </React.StrictMode>,
);

reportWebVitals();
