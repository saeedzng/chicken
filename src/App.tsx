import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMasterContract } from "./hooks/useMasterContract";
import { useWalletContract } from "./hooks/useWalletContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano, address, Address } from "ton-core";
import { useState, useEffect } from 'react';

function App() {
  const [page_n, setPageN] = useState(0); // Use useState for managing page navigation
  const { connected } = useTonConnect();
  const { master_contract_address, sendDeployByMaster, master_contract_balance, wc_addressss } = useMasterContract();
  const [walletContractAddress, setWalletContractAddress] = useState<string | null>(null); // Corrected the state type to string or null
  const { ch_number, eggs_number, wallet_contract_balance, wallet_contract_address, 
    send_buy_chicken_order, wallet_owner_address, wallet_referal_address, wallet_master_address,
    send_sell_chicken_order, send_recive_eggs_order } = useWalletContract(walletContractAddress ? Address.parse(walletContractAddress) : Address.parse("kQDAz5XMJoGW3TJE8a6QwreoTTGjPcPGvAOWm_yD1_k-S3jL"));
  const [referal_address, setReferal_address] = useState('');

  // Extract referral address from URL parameters and update state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddressFromUrl = urlParams.get('walletAddress');
    if (walletAddressFromUrl) {
      setReferal_address(walletAddressFromUrl);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <nav className="menu">
        <ul>
          <li><button onClick={() => setPageN(0)}>Home</button></li>
          <li><button onClick={() => setPageN(1)}>Master Contract</button></li>
          <li><button onClick={() => setPageN(2)}>Wallet Contract</button></li>
          <li><TonConnectButton /></li>
        </ul>
      </nav>
      {page_n === 0 && (
        <>
          <h1>Welcome to Chicken Farm</h1>
          {!connected && <p>Please Log in To Continue</p>}
          {connected && (
            <>
              <label>Your referral address</label>
              <input type="text" id="create_contract_b" value={referal_address} onChange={(e) => setReferal_address(e.target.value)} /><br /><br />
              <button className='button' onClick={() => { sendDeployByMaster(address(referal_address)); window.location.reload(); }}>Create Wallet Contract</button><br />
              <div>
                <label>Deployed contract at: <a>{wc_addressss && <div>{wc_addressss.toString()}</div>}</a></label>
              </div>
              <button onClick={() => {
                if (wc_addressss) {
                  setWalletContractAddress(wc_addressss.toString());
                  setPageN(2);
                }
              }}>Open Wallet Contract</button>
            </>
          )}
        </>
      )}
      {page_n === 1 && (
        <div>
          <h1>Master Contract</h1>
          <b>Master contract Address</b>
          <div className='Hint'>{master_contract_address}</div>
          <b>Master contract Balance</b>
          {master_contract_balance && <div className='Hint'>{fromNano(master_contract_balance)} ton</div>}
        </div>
      )}
      {page_n === 2 && (
        <div>
          <h1>Wallet Contract</h1>
          <div className='Card'>
            <div><b>Wallet contract balance</b></div>
            {wallet_contract_balance && <div className='Hint'>{fromNano(wallet_contract_balance)} ton</div>}
            <div><b>Wallet contract Address</b></div>
            <div className='Hint'>{wallet_contract_address}</div>
            <div><b>Wallet owner Address</b></div>
            <div className='Hint'>{wallet_owner_address}</div>
            <div><b>Wallet referral Address</b></div>
            <div className='Hint'>{wallet_referal_address}</div>
            <div><b>Wallet master Address</b></div>
            <div className='Hint'>{wallet_master_address}</div>
            <div><b>Wallet eggs number</b></div>
            {eggs_number && <div className='Hint'>{fromNano(eggs_number)} ton</div>}
            <div><b>Wallet chicken number</b></div>
            <div className='Hint'>{ch_number}</div>
            {connected && page_n === 2 && (
              <a onClick={() => { send_buy_chicken_order(1); }}>buy 1 chicken</a>
            )}<br />
            {connected && (
              <a onClick={() => { send_sell_chicken_order(1); }}>sell 1 chicken</a>
            )}<br />
            {connected && (
              <a onClick={() => { send_recive_eggs_order(); }}>get earned eggs</a>
            )}
          </div>
          <div>
            <button onClick={() => {
              const shareUrl = `${window.location.href}?walletAddress=${wallet_contract_address}`;
              navigator.share({
                title: 'Chicken Farm Wallet Contract',
                text: 'Check out this wallet contract address!',
                url: shareUrl,
              });
            }}>
              Share Wallet Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
