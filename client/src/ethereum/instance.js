import LottoMachine from './build/LottoMachine.json';
import SlotMachine from './build/SlotMachine.json';

const instance = new window.web3.eth.contract(
  JSON.parse(LottoMachine.interface),
  '0x1134bF3932978535e50668d3731185c8Fa165Aa0'
);

const instance2 = new window.web3.eth.contract(
  JSON.parse(SlotMachine.interface),
  '0xcD34397f88C5f8e0817f93790230Ee8A218C68db'
);

export { instance, instance2 };
