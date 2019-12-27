const keys = require('../config/keys');
const { getWeb3 } = require('./web3');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// set the contract instance
const web3 = getWeb3();

module.exports.getContractInstance = async function(ABI, address) {
  const contractInstance = await new web3.eth.Contract(ABI, address, {
    from: keys.WALLET_ADDRESS, // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
  });

  const getWallet = await contractInstance.methods.ceoAddress().call();
  console.log('CEO address (only allowed)): ' + getWallet);
  console.log('server wallet address: ' + keys.WALLET_ADDRESS);
  console.log('game contract address: ' + address);

  return contractInstance;
};
