import Arweave from 'arweave';
import React, { Dispatch, createContext, useContext, useReducer } from 'react';
import type {
  ArweaveDataProvider,
  ArweaveWalletConnector,
  SmartweaveDataProvider,
} from '../../types';
import { ArweaveCompositeDataProvider } from '../../services/arweave/ArweaveCompositeDataProvider';
import { SimpleArweaveDataProvider } from '../../services/arweave/SimpleArweaveDataProvider';
import { WarpDataProvider } from '../../services/arweave/WarpDataProvider';
import type { Action } from '../reducers/GlobalReducer';

const defaultArweave = new Arweave({
  host: 'arweave.net',
  protocol: 'https',
});

export type GlobalState = {
  arweaveDataProvider: ArweaveDataProvider & SmartweaveDataProvider;
  gateway: string;
  walletAddress?: string;
  wallet?: ArweaveWalletConnector;
  showConnectWallet: boolean;
  errors: Array<Error>;
  notifications: { id: string; text: string }[];
};

const initialState: GlobalState = {
  arweaveDataProvider: new ArweaveCompositeDataProvider(
    new WarpDataProvider(defaultArweave),
    new SimpleArweaveDataProvider(defaultArweave),
  ),
  gateway: 'arweave.net',
  walletAddress: undefined,
  showConnectWallet: false,
  wallet: undefined,
  errors: [],
  notifications: [],
};

const GlobalStateContext = createContext<[GlobalState, Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

export const useGlobalState = (): [GlobalState, Dispatch<Action>] =>
  useContext(GlobalStateContext);

type StateProviderProps = {
  reducer: React.Reducer<GlobalState, Action>;
  children: React.ReactNode;
};

/** Create provider to wrap app in */
export default function GlobalStateProvider({
  reducer,
  children,
}: StateProviderProps): JSX.Element {
  const [state, dispatchGlobalState] = useReducer(reducer, initialState);
  return (
    <GlobalStateContext.Provider value={[state, dispatchGlobalState]}>
      {children}
    </GlobalStateContext.Provider>
  );
}
