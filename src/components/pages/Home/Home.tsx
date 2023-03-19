import { useEffect, useState } from 'react';

import { useWalletAddress } from '../../../hooks/index';
import { useGlobalState } from '../../../state/contexts/GlobalState';
import { ARNS_TX_ID_REGEX } from '../../../utils/constants';
import './styles.css';

function Home() {
  const [{ arweaveDataProvider }] = useGlobalState();
  const { walletAddress } = useWalletAddress();


  return (
    <div className="page">
   
    </div>
  );
}

export default Home;
