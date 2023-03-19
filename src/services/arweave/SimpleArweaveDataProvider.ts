/* eslint-disable @typescript-eslint/no-unused-vars */
import Arweave from 'arweave/node';
import Ar from 'arweave/node/ar';

import {
  ArweaveDataProvider,
  TransactionHeaders,
  TransactionTag,
} from '../../types';
import { isArweaveTransactionID, tagsToObject, approvedContractsForWalletQuery } from '../../utils/constants';

export class SimpleArweaveDataProvider implements ArweaveDataProvider {
  private _arweave: Arweave;
  private _ar: Ar = new Ar();

  constructor(arweave: Arweave) {
    this._arweave = arweave;
  }

  async getWalletBalance(id: string): Promise<number> {
    const winstonBalance = await this._arweave.wallets.getBalance(
      id.toString(),
    );
    return +this._ar.winstonToAr(winstonBalance);
  }

  async getTransactionStatus(id: string) {
    const { status, data } = await this._arweave.api.get(`/tx/${id}/status`);
    if (status !== 200) {
      throw Error('Failed fetch confirmations for transaction id.');
    }
    return +data.number_of_confirmations;
  }

  async getTransactionTags(
    id: string,
  ): Promise<{ [x: string]: string }> {
    const { data: tags } = await this._arweave.api.get(
      `/tx/${id.toString()}/tags`,
    );
    const decodedTags = tagsToObject(JSON.parse(tags));
    return decodedTags;
  }

  async getContractsForWallet(
    address: string,
    approvedSourceCodeTransactions?: string[],
    cursor?: string,
  ): Promise<{
    ids: string[];
    isLastPage: boolean;
    cursor?: string;
  }> {
    const fetchedANTids: Set<string> = new Set();
    let newCursor: string | undefined = undefined;
    let isLastPage = false;

    // get contracts deployed by user, filtering with src-codes to only get ANT contracts

    const deployedResponse = await this._arweave.api.post(
      '/graphql',
      approvedContractsForWalletQuery(
        address,
        approvedSourceCodeTransactions,
        cursor,
      ),
    );
    if (deployedResponse.data.data?.transactions?.edges?.length) {
      deployedResponse.data.data.transactions.edges
        .map((e: any) => ({
          id: e.node.id,
          cursor: e.cursor,
          isLastPage: !e.pageInfo?.hasNextPage,
        }))
        .forEach(
          (contract: {
            id: string;
            cursor: string;
            isLastPage: boolean;
          }) => {
            fetchedANTids.add(contract.id);
            if (contract.cursor) {
              newCursor = contract.cursor;
            }
            if (contract.isLastPage) {
              isLastPage = contract.isLastPage;
            }
          },
        );
    }
    return {
      ids: [...fetchedANTids],
      cursor: newCursor,
      isLastPage: isLastPage,
    };
  }

  async getTransactionHeaders(
    id: string,
  ): Promise<TransactionHeaders> {
    const {
      status,
      data: headers,
    }: { status: number; data: TransactionHeaders } =
      await this._arweave.api.get(`/tx/${id.toString()}`);
    if (status !== 200) {
      throw Error(`Transaction ID not found. Try again. Status: ${status}`);
    }
    return headers;
  }

  async validateTransactionTags({
    id,
    requiredTags = {},
  }: {
    id: string;
    requiredTags?: { [x: string]: string[] };
  }): Promise<void> {
    const txID = await this.validateArweaveId(id);

    // fetch the headers to confirm transaction actually exists
    await this.getTransactionHeaders(txID);

    // validate tags
    if (requiredTags) {
      const tags = await this.getTransactionTags(txID);
      // check that all required tags exist, and their values are allowed
      Object.entries(requiredTags).map(([requiredTag, allowedValues]) => {
        if (Object.keys(tags).includes(requiredTag)) {
          if (allowedValues.includes(tags[requiredTag])) {
            // allowed tag!
            return true;
          }
          throw Error(
            `${requiredTag} tag is present, but as an invalid value: ${tags[requiredTag]}. Allowed values: ${allowedValues}`,
          );
        }
        throw Error(`Contract is missing required tag: ${requiredTag}`);
      });
    }
  }
  async validateArweaveId(id: string): Promise<string> {
    // a simple promise that throws on a poorly formatted transaction id
    return new Promise((resolve, reject) => {
      try {
        if (!isArweaveTransactionID(id)){
          throw new Error("Not a valid arweave transaction ID")
        };
        resolve(id);
      } catch (error: any) {
        reject(error);
      }
    });
  }

  async validateConfirmations(
    id: string,
    numberOfConfirmations = 1,
  ): Promise<void> {
    const txId = await this.validateArweaveId(id);

    // fetch the headers to confirm transaction actually exists
    await this.getTransactionHeaders(txId);

    // validate confirmations
    if (numberOfConfirmations > 0) {
      const confirmations = await this.getTransactionStatus(txId);
      if (confirmations < numberOfConfirmations) {
        throw Error(
          `Contract ID does not have required number of confirmations. Current confirmations: ${confirmations}. Required number of confirmations: ${numberOfConfirmations}.`,
        );
      }
    }
  }

  async getArPrice(dataSize: number): Promise<number> {
    try {
      const result = await this._arweave.api.get(`/price/${dataSize}`);

      return +this._arweave.ar.winstonToAr(result.data, { formatted: true });
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
}
