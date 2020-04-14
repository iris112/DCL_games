const { getContractInstance } = require('./contractInstance');
const ABIMasterParent = require('../ethereum/contracts/parent/ABIMasterParent');
const keys = require('../config/keys');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const { getWeb3 } = require('./web3');
const crypto = require('crypto');
const fs = require('fs');

var hashList = [];
var hashSize = 10000;
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

function readLines(input) {
  return new Promise(async (resolve, reject) => {
    var remaining = '';

    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      var last  = 0;
      while (index > -1) {
        var line = remaining.substring(last, index);
        last = index + 1;
        hashList.push(line);
        index = remaining.indexOf('\n', last);
      }

      remaining = remaining.substring(last);
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        var index = remaining.indexOf('\n');
        hashList.push(remaining.substring(0, index));
      }
      resolve();
    });
  });
}

async function generateHashList() {
  const writeStream = fs.createWriteStream('hashlist.txt');
  writeStream.on('error', function(err) { 
    console.log(err);
  });

	var tail = crypto.randomBytes(32).toString('hex');
	var ret;
	for (var i = 0; i < hashSize; i++) {
		ret = web3.utils.soliditySha3(tail);
		writeStream.write(ret + '\n');
		tail = ret;
  }
  
  writeStream.end();
}

async function setTailHash() {
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
}

async function initHash() {
  const readStream = fs.createReadStream('hashlist.txt');
  await readLines(readStream);

  //set tail on master contract with hashSize index
  if (!contractMasterParent) {
    contractMasterParent = await getContractInstance(
      ABIMasterParent,
      keys.MASTER_PARENT_ADDRESS
    );
  }

  const currentTail = await contractMasterParent.methods.tail().call();
  hashPos = hashList.indexOf(currentTail) + 1;
  if (hashPos < 1) {
    hashPos = hashSize;
    await setTailHash();
  }

  hashPos--;
}


module.exports.getHash = async () => {
  if (!hashList.length)
    await initHash();
  else {
    const currentTail = await contractMasterParent.methods.tail().call();
    hashPos = hashList.indexOf(currentTail);
  }

  if (hashPos == 0) {
    hashPos = hashSize;
    await setTailHash();
    hashPos--;
  }

  var ret = hashList[hashPos - 1];
  hashPos--;

  return ret;
};
