import web3 from './web3';
import LottoMachine from './build/LottoMachine.json';
import SlotMachine from './build/SlotMachine.json';

const instance = new web3.eth.Contract(
  JSON.parse(LottoMachine.interface),
  '0x1134bF3932978535e50668d3731185c8Fa165Aa0'
);

const instance2 = new web3.eth.Contract(
  JSON.parse(SlotMachine.interface),
  '0xcD34397f88C5f8e0817f93790230Ee8A218C68db'
);

export { instance, instance2 };
