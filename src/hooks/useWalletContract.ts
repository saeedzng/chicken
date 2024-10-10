import { useEffect, useState } from "react";
import { WalletContract } from "../contracts/WalletContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from 'ton-core';
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";


export function useWalletContract() {
  const client = useTonClient();
  const {sender} = useTonConnect();
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
  const [contractData, setContractData] = useState<null | {
    ch_number : number;
    owner_address : Address;
    master_address: Address;
    eggs_number : number;
    last_calc : number;
  }>();
  const [ balance , setBalance]  = useState<null |number>(0);
  const walletContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new WalletContract(
      Address.parse("EQDraiszPPESm9IDgB_UA6GXyzLwMiXjvyxSBeFZw3h2xNqn") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<WalletContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!walletContract) return;
      setContractData(null);
      const val = await walletContract.getData();
      const balance = await walletContract.getBalance();
      setContractData({
       ch_number: val.chicken_number,
       owner_address: val.owner_address,
       master_address: val.master_address,
       eggs_number: val.eggs_number,
       last_calc: val.last_payout,
      });
      setBalance(balance.number);
      await sleep(15000); // sleep 15 seconds and poll value again
      getValue();
    }
    getValue();
  }, [walletContract]);

  return {
    wallet_contract_address: walletContract?.address.toString(),
    wallet_contract_balance:balance ,
    ...contractData,
    send_buy_chicken_order: () => {
        return walletContract?.send_buy_chicken_order(sender,toNano(0.1));
    },
    send_sell_chicken_order: () => {
        return walletContract?.send_buy_chicken_order(sender,toNano(0.02));
    },
    send_recive_eggs_order: () => {
        return walletContract?.send_buy_chicken_order(sender,toNano(0.02));
    }
  };
}
