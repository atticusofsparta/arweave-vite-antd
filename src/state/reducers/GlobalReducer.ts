import { v4 as uuidv4 } from 'uuid';

import type {
  ArweaveDataProvider,
  ArweaveWalletConnector,
  SmartweaveDataProvider,
} from '../../types';
import { GlobalState } from '../contexts/GlobalState';

export type Action =
  | { type: 'setWalletAddress'; payload: string | undefined }
  | {
      type: 'setWallet';
      payload: ArweaveWalletConnector | undefined;
    }
  | { type: 'setGateway'; payload: string }
  | { type: 'setShowConnectWallet'; payload: boolean }
  | {
      type: 'setArweaveDataProvider';
      payload: ArweaveDataProvider & SmartweaveDataProvider;
    }
  | { type: 'pushNotification'; payload: string }
  | { type: 'removeNotification'; payload: string };

export const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'setArweaveDataProvider':
      return {
        ...state,
        arweaveDataProvider: action.payload,
      };
    case 'setWalletAddress':
      return {
        ...state,
        walletAddress: action.payload,
      };
    case 'setWallet':
      return {
        ...state,
        wallet: action.payload,
      };
    case 'setShowConnectWallet':
      return {
        ...state,
        showConnectWallet: action.payload,
      };

    case 'setGateway':
      return {
        ...state,
        gateway: action.payload,
      };
    case 'pushNotification': {
      return {
        ...state,
        notifications: state.notifications.concat([
          {
            id: uuidv4(),
            text: action.payload,
          },
        ]),
      };
    }
    case 'removeNotification': {
      return {
        ...state,
        notifications: state.notifications.filter(
          (e: { id: string }) => e.id !== action.payload,
        ),
      };
    }
    default:
      return state;
  }
};
