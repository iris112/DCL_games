const { getContractInstance } = require('./contractInstance');
const ABIMasterParent = require('../ethereum/contracts/parent/ABIMasterParent');
const keys = require('../config/keys');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const { getWeb3 } = require('./web3');
const crypto = require('crypto');

var hashList = [];
var hashSize = 500;
var hashPos;
var contractMasterParent = null;
var web3 = getWeb3();
web3.eth.defaultAccount = keys.WALLET_ADDRESS;

const delay = ms => new Promise(res => setTimeout(res, ms));
function waitConfirmedTx(txHash) {
  return new Promise(async (resolve, reject) => {
    var finish = false;
    while (!finish) {
      web3.eth.getTransactionReceipt(txHash, (err, res) => {
        if (err) {
          finish = true;
          reject(err);
        }
        if (res) {
          finish = true;
          resolve(res);
        }
      });
      await delay(2000);
    }
  });
}

async function generateHashList() {
	var now = new Date();
	var tail = crypto.randomBytes(32).toString('hex');
	var ret;
	for (var i = 0; i < 500; i++) {
		ret = web3.utils.soliditySha3(tail);
		hashList.push(ret);
		tail = ret;
	}
}

module.exports.getHash = async () => {
  if (!hashList.length || hashPos == 0) {
    await generateHashList();
    hashPos = hashSize;

    //set tail on master contract with hashSize index
    if (!contractMasterParent) {
      contractMasterParent = await getContractInstance(
        ABIMasterParent,
        keys.MASTER_PARENT_ADDRESS
      );
    }

    const contractFunction = contractMasterParent.methods.setTail(
      hashList[hashPos - 1]
    );

    const functionABI = contractFunction.encodeABI();
    const _nonce = await web3.eth.getTransactionCount(
      keys.WALLET_ADDRESS,
      'pending'
    );

    const gasMultiple = parseInt(
      (await contractFunction.estimateGas({ from: keys.WALLET_ADDRESS })) * 1.5
    );

    console.log('nonce: ' + _nonce);
    console.log('gas amount * 1.5: ' + gasMultiple);

    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'matic-testnet2',
        networkId: 8995,
        chainId: 8995
      },
      'petersburg'
    );

    const tx = new Tx(
      {
        gasPrice: web3.utils.toHex(20000000000),
        gasLimit: web3.utils.toHex(gasMultiple),
        to: contractMasterParent.options.address,
        data: functionABI,
        from: keys.WALLET_ADDRESS,
        nonce: web3.utils.toHex(_nonce)
      },
      { common: customCommon }
    );

    const privateKey = Buffer.from(keys.WALLET_PRIVATE_KEY, 'hex');
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    var result = await web3.eth.sendSignedTransaction(
      '0x' + serializedTx.toString('hex')
    );
    if (result.transactionHash) result = result.transactionHash;

    await waitConfirmedTx(result);
    hashPos--;
  }

  var ret = hashList[hashPos - 1];
  hashPos--;

  return ret;
};
