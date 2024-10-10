import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';


export type MasterConfig = {
    wallet_contract_codecell : Cell;
    owner_address : Address;
};

export function masterConfigToCell(config: MasterConfig): Cell {
    return beginCell()
    .storeRef(config.wallet_contract_codecell)
    .storeAddress(config.owner_address)
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

    async sendDeployByMaster(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(4,32).endCell(),
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
              balance: stack.readNumber(),
            }
    }
}

