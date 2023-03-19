import Arweave from 'arweave/web/common';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { isString } from 'lodash';
import { ArweaveWalletConnector } from '../../types';

// A lot to do here, r.e. security, we will likely move to a different approach.
export class JsonWalletConnector implements ArweaveWalletConnector {
  private _walletFile;
  private _wallet?: JWKInterface; // eslint-disable-line
  private _arweave;

  constructor(file: any) {
    this._walletFile = file;
    this._arweave = Arweave.init({
      host:'arweave.net',
      port:443,
      protocol:'https'
    })
  }

  async connect(): Promise<void> {
    try {
      if (this._walletFile.type !== 'application/json') {
        throw Error('Invalid wallet file, must be a json file');
      }
      const jsonWallet: JWKInterface = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target?.result) {
            throw Error('Cannot read keyfile');
          }
          const str = e.target.result;
          if (!isString(str)) {
            return;
          }
          const json = JSON.parse(str);
          // resolve when it's done
          resolve(json);
        };
        // start the read
        reader.readAsText(this._walletFile);
      });

      if (!jsonWallet) {
        throw Error('Failed to load JSON wallet.');
      }
      // TODO: we need encryption
      this._wallet = jsonWallet;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this._wallet = undefined;
    this._walletFile = undefined;
  }

  async getWalletAddress(): Promise<string> {
    try {
      const address = this._arweave.wallets.getAddress(this._wallet)
      if (!address) {
        throw new Error("Unable to get address")
      }
      return (address)
      
    } catch (error) {
      console.error(error)
      return ""
    }
    
  }
}
