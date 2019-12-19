import { web3 } from './web3';
import Digipet from './build/Digipet.json';

// 0x7081e2057C55321322F6f6824e8C597172bdd574 // rinkeby contract address
// 0x4848882c876043FBa9FD48AC4939C806FD56A2eB // main net contract address

const instance = new web3.eth.Contract(
  JSON.parse(Digipet.interface),
  '0x4848882c876043FBa9FD48AC4939C806FD56A2eB'
);

export default instance;
