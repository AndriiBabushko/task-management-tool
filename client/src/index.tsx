import React from 'react';
import { createRoot } from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import './index.css';
import { App } from './app/App';
import { RootStoreContext } from './app/context/rootStoreContext';
import RootStore from './app/store/rootStore';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={new RootStore()}>
      <App />
    </RootStoreContext.Provider>
  </React.StrictMode>,
);

reportWebVitals();
