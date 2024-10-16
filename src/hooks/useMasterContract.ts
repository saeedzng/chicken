import { useEffect, useState } from "react";
import { Master } from "../contracts/Master";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from 'ton-core';
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";
// export const referal_address : Address = Address.parse ("EQAtl3w8VMCTDG1_acX4DoDOXSP1mdvWpIWHsvGigtfShx9n");

export function useMasterContract() {
  
  const client = useTonClient();
  const {sender} = useTonConnect();
  const [contractData, setContractData] = useState<null | {
    owner_address : Address;
  }>();
  const [ balance , setBalance]  = useState<null |number>(0);
  // const [referal_address ,setReferal_address] = useState<null |{wallet_contract_referal : Address}>();
  const masterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Master(
      Address.parse("EQAKn89RWcZH3buVC7ISRN_aWo016-Cnx3u6KSHv3mpEU9D0") // replace with your address from tutorial 2 step 8
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
      setBalance(balance.number);
    }
    getValue();
  }, [masterContract]);

  return {
    master_contract_address: masterContract?.address.toString(),
    master_contract_balance:balance ,
    ...contractData,
    sendDeploy: () => {
      return masterContract?.sendDeploy(sender,toNano(0.02));
  },
  sendDeployByMaster: (wc_referal:Address) => {
      return masterContract?.sendDeployByMaster(sender,toNano(0.02),wc_referal);
  },
  
  };
}
