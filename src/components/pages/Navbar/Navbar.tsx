

import ConnectButton from '../../inputs/buttons/ConnectButton/ConnectButton';
import './styles.css';

function NavBar() {
  // eslint-disable-next-line
  return (
    <div className="flex-row flex-space-between">
      <div className="flex-row flex-left">
        <ConnectButton />
      </div>
   
    </div>
  );
}

export default NavBar;
