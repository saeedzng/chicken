import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';


export type MasterConfig = {
    total_supply : Number;
    admin_address : Address;
    wallet_contract_codecell : Cell;

};

export function masterConfigToCell(config: MasterConfig): Cell {
    return beginCell()
    .storeCoins(0)
    .storeAddress(config.admin_address)
    .storeRef(config.wallet_contract_codecell)
    .endCell();
}

export class Master implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Master(address);
    }

    static createFromConfig(config: MasterConfig, code: Cell, workchain = 0) {
        const data = masterConfigToCell(config);
        const init = { code, data };
        return new Master(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendDeployByMaster(provider: ContractProvider, via: Sender, value: bigint,referal_address:Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0,32).storeAddress(referal_address).endCell(),
        });
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_contract_owner_address", []);
        return {
          owner_sender: stack.readAddress(),
        };
    }
    
        async getBalance (provider : ContractProvider) {
            const { stack } = await provider.get("balance", []);
            return{
              number: stack.readNumber(),
            }
    }
}

