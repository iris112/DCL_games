const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const keys = require('../config/keys');
const { getWeb3 } = require('./web3');
const { getContractInstance } = require('./contractInstance');
const ABISlotsMANA = require('../ethereum/contracts/slots/ABISlotsMANA');
const dbMongo = require('../db/dbMongo');

dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// set the Matic provider and contract instance
let web3;
let contractSlotsMANA;

async function setProviderAndInstance() {
  web3 = getWeb3();
  web3.eth.defaultAccount = keys.WALLET_ADDRESS;

  contractSlotsMANA = await getContractInstance(
    ABISlotsMANA,
    keys.SLOTS_MANA_ADDRESS
  );
}

setProviderAndInstance();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.prepareTransaction = async messageJSON => {
  const machineID = messageJSON.machineID;
  const walletAddress = messageJSON.walletAddress;
  const coinName = messageJSON.gameData.coinName;
  const betAmount = messageJSON.gameData.betAmount;

  // get the land ID from the machine ID
  const landID = machineID.slice(0, 3);
  // const gameType = machineID.slice(3, 6);

  console.log('wallet address: ' + walletAddress);
  console.log('coin name: ' + coinName);
  console.log('bet amount: ' + betAmount);

  console.log('machine ID: ' + machineID);
  console.log('land ID: ' + landID);
  // console.log('game type: ' + gameType);

  const randomNumber = Math.ceil(Math.random() * 10000);

  console.log('random number: ' + randomNumber);

  const contractFunction = contractSlotsMANA.methods.play(
    walletAddress,
    landID,
    betAmount,
    machineID,
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
            to: contractSlotsMANA.options.address,
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
              try {
                //store session DB
                var playData = await dbMongo.insertPlayInfo({
                  address: walletAddress,
                  coinName: coinName,
                  machineID: machineID,
                  landID: landID,
                  betAmount: betAmount,
                  txid: txHash,
                  type: 'Slots'
                });

                if (playData) console.log('slots playinfo storing success');
                else console.log('slots playinfo storing failed');

                // store player DB
                var playerData = await dbMongo.findPlayerInfo({
                  address: walletAddress, type: 'Slots'
                });
                var incFreePlay = betAmount > 0 ? 0 : 1;
                var incPayoutPlay = betAmount > 0 ? 1 : 0;

                if (playerData) {
                  playerData = await dbMongo.updatePlayerInfo(
                    { address: playerData.address },
                    {
                      totalBetAmount:
                        Number(playerData.totalBetAmount) + Number(betAmount),
                      latestSessionDate: playData.createdAt,
                      numberOfFreePlays:
                        Number(playerData.numberOfFreePlays) + incFreePlay,
                      numberOfPayoutPlays:
                        Number(playerData.numberOfPayoutPlays) + incPayoutPlay
                    }
                  );
                } else {
                  playerData = await dbMongo.insertPlayerInfo({
                    address: walletAddress,
                    totalBetAmount: betAmount,
                    latestSessionDate: playData.createdAt,
                    numberOfFreePlays: incFreePlay,
                    numberOfPayoutPlays: incPayoutPlay,
                    type: 'Slots'
                  });
                }

                if (playerData) console.log('slots playerinfo storing success');
                else console.log('slots playerinfo storing failed');

                // store machineDB
                var machineData = await dbMongo.findMachineInfo({
                  machineID: machineID,
                  landID: landID,
                  playerAddresse: walletAddress,
                  type: 'Slots'
                });

                if (!machineData) {
                  machineData = await dbMongo.insertMachineInfo({
                    machineID: machineID,
                    landID: landID,
                    playerAddresse: walletAddress,
                    type: 'Slots'
                  });
                }

                if (machineData) console.log('slots machineinfo storing success');
                else console.log('slots machineinfo storing failed');

                // store machineTotalDB
                var machineTotalData = await dbMongo.findMachineTotalInfo({
                  machineID: machineID, type: 'Slots'
                });

                if (!machineTotalData) {
                  machineTotalData = await dbMongo.insertMachineTotalInfo({
                    machineID: machineID,
                    landID: landID,
                    totalBetAmount: betAmount,
                    latestSessionDate: playData.createdAt,
                    type: 'Slots'
                  });
                } else {
                  machineTotalData = await dbMongo.updateMachineTotalInfo(
                    { machineID: machineID, type: 'Slots' },
                    {
                      totalBetAmount:
                        Number(machineTotalData.totalBetAmount) +
                        Number(betAmount),
                      latestSessionDate: playData.createdAt,
                      type: 'Slots'
                    }
                  );
                  if (machineTotalData)
                    console.log('slots machinetotalinfo storing success');
                  else console.log('slots machinetotalinfo storing failed');
                }
              } catch (e) {
                console.log(e);
              }
            }
          });
        };

        sendTransaction();
      });
    });
};
