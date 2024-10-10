import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMasterContract } from "./hooks/useMasterContract";
import { useWalletContract } from "./hooks/useWalletContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";

function App() {
  const {
    master_contract_address,
    master_contract_balance,
  } = useMasterContract();
  const {
    ch_number,eggs_number,wallet_contract_balance,wallet_contract_address,send_buy_chicken_order,
    send_sell_chicken_order,send_recive_eggs_order,
  } = useWalletContract();
  const {connected} = useTonConnect();
  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Master contract Address</b>
          <div className='Hint'>{master_contract_address }</div>
          <b>Master contract Balance</b>
          {master_contract_balance && <div className='Hint'>{fromNano(master_contract_balance) } ton</div>}
          <b>wallet contract balance</b>
          {wallet_contract_balance && <div className='Hint'>{fromNano(wallet_contract_balance) } ton</div>}
          <b>wallet contract Address</b>
          <div className='Hint'>{wallet_contract_address }</div>
          <b>wallet eggs number</b>
          <div className='Hint'>{eggs_number}</div>
          <b>wallet chicken number</b>
          <div className='Hint'>{ch_number }</div>
          {connected && (
              <a
                onClick={() => {
                  send_buy_chicken_order();
                }}
              >
                buy 1 chicken
              </a>
            )}
              {connected && (
              <a
                onClick={() => {
                  send_sell_chicken_order();
                }}
              >
                sell 1 chicken
              </a>
            )}
              {connected && (
              <a
                onClick={() => {
                  send_recive_eggs_order();
                }}
              >
                get earned eggs
              </a>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;