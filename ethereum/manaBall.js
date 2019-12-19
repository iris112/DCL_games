import * as EthConnect from '../../node_modules/eth-connect/esm';
import { getProvider } from '@decentraland/web3-provider';
import { getUserAccount } from '@decentraland/EthereumController';
import MANA from '../../contracts/MANA/MANA'; // the MANA contract ABI

// 0x9d56e8b322d8c75168824cb44183cf3deaff5cd0 // slots contract on Matic
contractAddress: string = '0x9d56e8b322d8c75168824cb44183cf3deaff5cd0';
approvalAmount: number = 5000000000000000000000; // 5000 MANA

this.walletAddress = await getUserAccount();
const provider = await getProvider();
const requestManager = new EthConnect.RequestManager(provider);
const factory = new EthConnect.ContractFactory(requestManager, MANA);

this.contractInstanceMANAMatic = (await factory.at(
  '0xDd1B834a483fD754c8021FF0938f69C1d10dA81F'
)) as any;

ball.addComponent(
  new OnClick(error => {
    this.approveSlots(error);
  })
);

async approveSlots(error) {
  try {
    await this.contractInstanceMANAMatic.approve(
      this.contractAddress,
      this.approvalAmount,
      {
        from: this.walletAddress
      }
    );
  } catch (error) {
    log(error);
  }
}