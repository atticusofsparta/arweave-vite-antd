
import { Buffer } from 'buffer';
import { TransactionTag } from '../types';
import { fromB64Url } from './encodings';


// note: lookahead/lookbehind regex's are not compatible with iOS browsers
export const ARNS_TX_ID_REGEX = new RegExp('^[a-zA-Z0-9-_s+]{43}$');
export const ARNS_TX_ID_ENTRY_REGEX = new RegExp('^[a-zA-Z0-9-_s+]{1,43}$');
export const STUB_ARWEAVE_TXID = '2yHmORN-N12hM1B2f9-JPMpOfa59qhpsExFCzImrD30'; // arns spec pdf
export const WARP_CONTRACT_BASE_URL = 'https://sonar.warp.cc/#/app/contract/';
export const WARP_INTERACTION_BASE_URL =
  'https://sonar.warp.cc/#/app/interaction/';
  export const SMARTWEAVE_TAG_SIZE = 250; // required tag size in bytes

export const SMARTWEAVE_MAX_TAG_SPACE = 2048 - SMARTWEAVE_TAG_SIZE; // minimum tag size of smartweave tags from warp is 239, rounded it for wiggle room

export function isArweaveTransactionID(id: string) {
  if (!id) {
    return false;
  }
  if (!ARNS_TX_ID_REGEX.test(id)) {
    return false;
  }
  return true;
}

export function tagsToObject(tags: TransactionTag[]): {
  [x: string]: string;
} {
  return tags.reduce(
    (newTags, tag) => ({
      ...newTags,
      [fromB64Url(tag.name)]: fromB64Url(tag.value),
    }),
    {},
  );
}

export function byteSize(data: string): number {
  return Buffer.byteLength(data);
}


export const approvedContractsForWalletQuery = (
  address: string,
  approvedSourceCodeTransactions?: string[],
  cursor?: string,
) => {
  const queryObject = {
    query: `
  { 
    transactions (
      owners:["${address.toString()}"]
      tags:[
        {
          name:"Contract-Src",
          values:${JSON.stringify(
            approvedSourceCodeTransactions?.map((id) => id.toString()),
          )}
        }
      ],
      sort: HEIGHT_DESC,
      first: 100,
      ${cursor ? `after: ${cursor}` : ''}
    ) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          block {
            height
          }
        }
      }
    }
  }`,
  };
  return queryObject;
};
