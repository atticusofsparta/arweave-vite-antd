
import { ArweaveWalletConnector } from '../../types';

import { ArweaveWebWallet } from 'arweave-wallet-connector';




export class ArweaveDotAppConnector implements ArweaveWalletConnector {
  private _wallet;

  constructor() {
    this._wallet = new ArweaveWebWallet({ // Initialize the wallet as soon as possible to get instant auto reconnect
        name: 'Connector Example',
        logo: 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg'
    })
    this._wallet.setUrl('arweave.app')
  }

 async connect(): Promise<void> {
    // confirm they have the extension installed
    if (!window.arweaveWallet) {
      window.open('https://arconnect.io');
    }

    return await this._wallet.connect();
  }

  disconnect(): Promise<void> {
    return this._wallet.disconnect();
  }

  async getWalletAddress(): Promise<string> {
    try {
        const address = this._wallet.address

        if (!address) {
            throw new Error('Address is undefined')
        }
        return address
    } catch (error) {
        console.error(error)
        return ""
    }
    
  }
}
