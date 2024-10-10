import { useEffect, useState } from "react";
import { Master } from "../contracts/Master";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from 'ton-core';

export function useMasterContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    owner_address : Address;
  }>();
  const [ balance , setBalance]  = useState<null |number>(0);
  const masterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Master(
      Address.parse("EQBhDpj16lhx4aS5SlCXQe4K9ONp5D05zruZB69eYKiP1aV0") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Master>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!masterContract) return;
      setContractData(null);
      const val = await masterContract.getData();
      const balance = await masterContract.getBalance();
      setContractData({
        owner_address: val.owner_sender,
      });
      setBalance(balance.balance);
    }
    getValue();
  }, [masterContract]);

  return {
    master_contract_address: masterContract?.address.toString(),
    master_contract_balance:balance ,
    ...contractData,
  };
}
