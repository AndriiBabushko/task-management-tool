import { createContext } from 'react';
import RootStore from '../store/rootStore';

const rootStore = new RootStore();

export const RootStoreContext = createContext<RootStore>(rootStore);
