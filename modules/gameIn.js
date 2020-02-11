const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const keys = require('../config/keys');
const { getWeb3 } = require('./web3');
const { getContractInstance } = require('./contractInstance');
const ABIMasterParent = require('../ethereum/contracts/parent/ABIMasterParent');
const dbMongo = require('../db/dbMongo');
const { getHash } = require('./hashchain');

dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// set the Matic provider and contract instance
let web3;
let contractMasterParent;

async function setProviderAndInstance() {
  web3 = getWeb3();
  web3.eth.defaultAccount = keys.WALLET_ADDRESS;

  contractMasterParent = await getContractInstance(
    ABIMasterParent,
    keys.MASTER_PARENT_ADDRESS
  );
}
setProviderAndInstance();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.prepareTransaction = async messageJSON => {
  const machineID = messageJSON.machineID;
  const walletAddress = messageJSON.walletAddress;
  const coinName = messageJSON.gameData.coinName;
  const betIDs = messageJSON.gameData.betIDs;
  const betValues = messageJSON.gameData.betValues;
  const betAmounts = messageJSON.gameData.betAmounts;

  // parse the land ID and game type from the machine ID
  const landID = machineID.slice(0, 3);
  const gameType = machineID.slice(3, 6);

  console.log('game type: ' + gameType);
  console.log('wallet address: ' + walletAddress);
  console.log('land ID: ' + landID);
  console.log('machine ID: ' + machineID);
  console.log('bet IDs: ' + betIDs);
  console.log('bet values: ' + betValues);
  console.log('bet amount: ' + betAmounts);

  // get the hash value from our hash generator script
  const hash = await getHash();

  const hashString = hash;
  console.log('hashString: ' + hashString);

  // const hashBytes = web3.utils.asciiToHex(hash);
  // console.log('hashBytes: ' + hashBytes);

  console.log('coin name: ' + coinName);

  const contractFunction = contractMasterParent.methods.play(
    1,
    walletAddress,
    1,
    12,
    betIDs,
    betValues,
    betAmounts,
    hashString,
    coinName
  );
  const functionABI = contractFunction.encodeABI();

  contractFunction
    .estimateGas({ from: keys.WALLET_ADDRESS })
    .then(gasAmount => {
      web3.eth.getTransactionCount(keys.WALLET_ADDRESS).then(_nonce => {
        console.log('nonce: ' + _nonce);
        const gasMultiple = Math.floor(gasAmount * 1.5);
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

        const sendTransaction = async () => {
          var txHash;
          result = await web3.eth
            .sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .once('transactionHash', hash => {
              console.log('TxHash: ', hash);
              txHash = hash;
            })
            .on('receipt', console.log);

          console.log('transaction complete');
          web3.eth.getTransactionReceipt(txHash).then(async data => {
            if (data.status) {
              /////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////////////////////////////////////////////////////////////
              // write transaction data to mongoDB database
            }
          });
        };

        sendTransaction();
      });
    });
};
