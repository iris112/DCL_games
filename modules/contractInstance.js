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

	const ceoAddress = await contractInstance.methods.ceoAddress().call();
	const workerAddress = await contractInstance.methods.workerAddress().call();
	console.log('CEO address (onlyCEO)): ' + ceoAddress);
	console.log('worker address (onlyWorker)): ' + workerAddress);
	console.log('server wallet address: ' + keys.WALLET_ADDRESS);
	console.log('parent contract address: ' + address);

	return contractInstance;
};
