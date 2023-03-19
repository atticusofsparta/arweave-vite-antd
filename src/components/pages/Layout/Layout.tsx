import { Outlet } from 'react-router-dom';

import ConnectWalletModal from '../../modals/ConnectWalletModal/ConnectWalletModal';
import {
  useConnectWalletModal,
  useWalletAddress,
} from '../../../hooks/';
import { useGlobalState } from '../../../state/contexts/GlobalState';
import Footer from '../Footer/Footer';
import NavBar from '../Navbar/Navbar';
import { Notifications } from '../Notifications/Notifications';
import './styles.css';

function Layout() {
  const [{ notifications }] = useGlobalState();
  const { showConnectModal } = useConnectWalletModal();
  const { walletAddress } = useWalletAddress();

  return (
    <>
      <div className="header">
        <NavBar />
      </div>
      <div className="body">
        <Outlet />
        {/* TODO: add errors here */}
        <Notifications notifications={notifications} />
      </div>
      <div className="footer">
        <Footer />
      </div>
      <ConnectWalletModal show={showConnectModal} />
    </>
  );
}

export default Layout;
