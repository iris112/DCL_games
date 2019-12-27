const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const keys = require('../config/keys');
const { getWeb3 } = require('./web3');
const { getContractInstance } = require('./contractInstance');
const ABIRouletteMANA = require('../ethereum/contracts/roulette/ABIRouletteMANA');
const dbMongo = require('../db/dbMongo');

dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// set the Matic provider and contract instance
let web3;
let contractRouletteMANA;

async function setProviderAndInstance() {
  web3 = getWeb3();
  web3.eth.defaultAccount = keys.WALLET_ADDRESS;

  contractRouletteMANA = await getContractInstance(
    ABIRouletteMANA,
    keys.ROULETTE_MANA_ADDRESS
  );
}

setProviderAndInstance();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.prepareTransaction = async messageJSON => {
  const machineID = '001002015'; // messageJSON.machineID;
  const walletAddress = '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A'; // messageJSON.walletAddress;

  const betIDs = [3302]; // messageJSON.gameData.betIDs;
  const betValues = [0]; // messageJSON.gameData.betValues;
  const betAmount = [1000000000000000]; // messageJSON.gameData.betAmount;

  // get the land ID and game type from the machine ID
  const landID = machineID.slice(0, 3);
  const gameType = machineID.slice(3, 6);

  console.log('wallet address: ' + walletAddress);
  console.log('land ID: ' + landID);
  console.log('machine ID: ' + machineID);

  console.log('bet IDs: ' + betIDs);
  console.log('bet values: ' + betValues);
  console.log('bet amount: ' + betAmount);

  console.log('game type: ' + gameType);

  const randomNumber = Math.ceil(Math.random() * 10000);

  console.log('random number: ' + randomNumber);

  const contractFunction = contractRouletteMANA.methods.play(
    walletAddress,
    landID,
    machineID,
    betIDs,
    betValues,
    betAmount,
    randomNumber
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
            to: contractRouletteMANA.options.address,
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
            // write transaction data to mongoDB database
          });
        };

        sendTransaction();
      });
    });
};
