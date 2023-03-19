import { TransactionTag } from '../../types';
import {
  ArweaveDataProvider,
  SmartweaveDataProvider,
} from '../../types';

export class ArweaveCompositeDataProvider
  implements SmartweaveDataProvider, ArweaveDataProvider
{
  // NOTE: this class should not have any logic for performing queries itself, but rather logic for getting results from
  // an array of providers, using different strategies such as Promise.race or Promise.all.
  private _warpProvider: SmartweaveDataProvider;
  private _arweaveProvider: ArweaveDataProvider;

  // TODO: implement strategy methods
  constructor(
    warpProviders: SmartweaveDataProvider,
    arweaveProviders: ArweaveDataProvider,
  ) {
    this._warpProvider = warpProviders;
    this._arweaveProvider = arweaveProviders;
  }

  async getWalletBalance(id: string): Promise<number> {
    return this._arweaveProvider.getWalletBalance(id);
  }

  async getContractState(
    id: string,
  ): Promise<Object | undefined> {
    return this._warpProvider.getContractState(id);
  }

  async writeTransaction(
    id: string,
    payload: {
      function: string;
      [x: string]: any;
    },
  ): Promise<string | undefined> {
    return await this._warpProvider.writeTransaction(id, payload);
  }

  async getContractBalanceForWallet(
    id: string,
    wallet: string,
  ): Promise<number> {
    return this._warpProvider.getContractBalanceForWallet(id, wallet);
  }

  async getContractsForWallet(
    address: string,
    approvedSourceCodeTransactions?: string[],
    cursor?: string,
  ): Promise<{ ids: string[]; cursor?: string | undefined }> {
    return this._arweaveProvider.getContractsForWallet(
      address,
      approvedSourceCodeTransactions,
      cursor,
    );
  }

  async getTransactionStatus(id: string) {
    return this._arweaveProvider.getTransactionStatus(id);
  }

  async getTransactionTags(
    id: string,
  ): Promise<{ [x: string]: string }> {
    return this._arweaveProvider.getTransactionTags(id);
  }

  async validateTransactionTags(params: {
    id: string;
    numberOfConfirmations?: number;
    requiredTags?: {
      [x: string]: string[]; // allowed values
    };
  }) {
    return this._arweaveProvider.validateTransactionTags(params);
  }

  async validateArweaveId(id: string): Promise<string> {
    return this._arweaveProvider.validateArweaveId(id);
  }

  async validateConfirmations(id: string): Promise<void> {
    return this._arweaveProvider.validateConfirmations(id);
  }

  async deployContract({
    srcCodeTransactionId,
    initialState,
    tags,
  }: {
    srcCodeTransactionId: string;
    initialState: Object;
    tags?: TransactionTag[];
  }): Promise<string> {
    return await this._warpProvider.deployContract({
      srcCodeTransactionId,
      initialState,
      tags,
    });
  }
  async getArPrice(data: number): Promise<number> {
    return await this._arweaveProvider.getArPrice(data);
  }
}
