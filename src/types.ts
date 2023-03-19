import type { Dispatch, SetStateAction } from 'react';

import { ARNS_TX_ID_REGEX } from './utils/constants';

export type TransactionHeaders = {
  id: string;
  signature: string;
  format: number;
  last_tx: string;
  owner: string;
  target: string;
  quantity: string;
  reward: string;
  data_size: string;
  data_root: string;
  tags: TransactionTag[];
};

export type TransactionTag = {
  name: string;
  value: string;
};


export type JsonWalletProvider = {
  key: any;
};

export interface SmartweaveDataProvider {
  getContractState(id: string): Promise<any>;
  writeTransaction(
    id: string,
    payload: {
      function: string;
      [x: string]: any;
    },
    dryWrite?: boolean,
  ): Promise<string | undefined>;
  getContractBalanceForWallet( // gets all contract ID's deployed by a wallet
    id: string,
    wallet: string,
  ): Promise<number>;
  deployContract({
    srcCodeTransactionId,
    initialState,
    tags,
  }: {
    srcCodeTransactionId: string;
    initialState: any;
    tags?: TransactionTag[];
  }): Promise<string>;

}

export interface ArweaveWalletConnector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getWalletAddress(): Promise<string>;
}

export interface ArweaveDataProvider {
  // add isAddress method
  getTransactionStatus(id: string): Promise<number>;
  getTransactionTags(
    id: string,
  ): Promise<{ [x: string]: string }>;
  validateTransactionTags(params: {
    id: string;
    requiredTags?: {
      [x: string]: string[]; // allowed values : example, owner must be connected wallet
    };
  }): Promise<void>;
  validateArweaveId(id: string): Promise<string>;
  validateConfirmations(
    id: string,
    numberOfConfirmations?: number,
  ): Promise<void>;
  getContractsForWallet(
    address: string,
    approvedSourceCodeTransactions?: string[],
    cursor?: string,
  ): Promise<{ ids: string[]; cursor?: string }>;
  getWalletBalance(id: string): Promise<number>; // ar balance
  getArPrice(data: number): Promise<number>; // gets the price in AR to upload data
}

export type ConnectWalletModalProps = {
  setShowModal: Dispatch<SetStateAction<boolean>>;
};