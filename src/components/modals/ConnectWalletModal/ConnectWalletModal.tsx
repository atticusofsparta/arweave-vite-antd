import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useWalletAddress } from '../../../hooks';
import { ArConnectWalletConnector, ArweaveDotAppConnector, JsonWalletConnector } from '../../../services/wallets';
import { useGlobalState } from '../../../state/contexts/GlobalState';
import { ArweaveWalletConnector } from '../../../types';
import { ArConnectIcon, ArweaveAppIcon, CloseIcon } from '../../icons';
import './styles.css';

function ConnectWalletModal({ show }: { show: boolean }): JSX.Element {
  const modalRef = useRef(null);
  const [{}, dispatchGlobalState] = useGlobalState(); // eslint-disable-line
  const { wallet, walletAddress } = useWalletAddress();
  useEffect(() => {
    // disable scrolling when modal is in view
    if (wallet && walletAddress) {
      dispatchGlobalState({
        type: 'setShowConnectWallet',
        payload: false,
      });
    }
    if (show) {
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = 'unset';
  }, [show, wallet, walletAddress]);

  function handleClickOutside(e: any) {
    if (modalRef.current && modalRef.current === e.target) {
      closeModal();
    }
    return;
  }

  function closeModal() {
    dispatchGlobalState({
      type: 'setShowConnectWallet',
      payload: false,
    });
  }

  async function setGlobalWallet(walletConnector: ArweaveWalletConnector) {
    try {
      await walletConnector.connect();
      dispatchGlobalState({
        type: 'setWallet',
        payload: walletConnector,
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  return show ? (
    // eslint-disable-next-line
    <div
      className="modal-container"
      ref={modalRef}
      onClick={handleClickOutside}
    >
      <div className="connect-wallet-modal">
        <p
          className="section-header"
          style={{ marginBottom: '1em', color:'var(--text-white)' }}
        >
          Connect with an Arweave wallet
        </p>
        <button className="modal-close-button" onClick={closeModal}>
          <CloseIcon width="30px" height={'30px'} fill="var(--text-white)" />
        </button>

        <button
          className="wallet-connect-button h2"
          onClick={() => {
            setGlobalWallet(new ArConnectWalletConnector());
          }}
        >
          <ArConnectIcon
            className="external-icon"
            width={'47px'}
            height={'47px'}
          />
          Connect via ArConnect
        </button>
        <button className="wallet-connect-button h2" onClick={() => {
            setGlobalWallet(new ArweaveDotAppConnector());
          }}>
          <img className="external-icon" src={ArweaveAppIcon} alt="" />
         Connect via Arweave.app
        </button>

        <button className="wallet-connect-button h2">
        <img className="external-icon" src={ArweaveAppIcon} alt="" />
          Import your JSON keyfile
          <label className="span-all">
            <input
              className="hidden"
              type="file"
              onChange={(e) =>
                e.target?.files?.length &&
                setGlobalWallet(new JsonWalletConnector(e.target.files[0]))
              }
            />
          </label>
        </button>
       

        
         
          <Link
            target="_blank"
            to="https://ardrive.io/start"
            rel="noreferrer"
            style={{
              width:'100%'
            }}
          >
            <button className="wallet-connect-button h2" style={{
          justifyContent:'center',
          textDecoration:"none"
        }}>
            I need a wallet
          
        </button>
        </Link>
      </div>
    </div>
  ) : (
    <></>
  );
}
export default ConnectWalletModal;
