

import { useWalletAddress } from '../../../hooks';
import ConnectButton from '../../inputs/buttons/ConnectButton/ConnectButton';
import './styles.css';

function NavBar() {
  // eslint-disable-next-line

  const {walletAddress} = useWalletAddress()
  return (
    <div className="flex-row flex-space-between">
      <div className="flex-row flex-left">
        <ConnectButton />
        <span>{walletAddress ?? "no wallet connected"}</span>
      </div>
   
    </div>
  );
}

export default NavBar;
