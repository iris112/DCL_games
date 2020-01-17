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

	contractRouletteMANA = await getContractInstance(ABIRouletteMANA, keys.ROULETTE_MANA_ADDRESS);
}

setProviderAndInstance();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.prepareTransaction = async (messageJSON) => {
	const machineID = messageJSON.machineID; // '001002015'; //
	const walletAddress = messageJSON.walletAddress;

	console.log('machine ID: ' + machineID);
	console.log('wallet address: ' + walletAddress);

	const betIDs = messageJSON.gameData.betIDs; // [3304]; //
	const betValues = messageJSON.gameData.betValues; // [0]; //
	const betAmounts = messageJSON.gameData.betAmounts; // [25000000000000000000]; //

	console.log('bet IDs: ' + betIDs);
	console.log('bet values: ' + betValues);
	console.log('bet amount: ' + betAmounts);

	// get the land ID and game type from the machine ID
	const landID = machineID.slice(0, 3);
	const gameType = machineID.slice(3, 6);

	console.log('land ID: ' + landID);
	console.log('game type: ' + gameType);

	const randomNumber = Math.ceil(Math.random() * 10000);

	console.log('random number: ' + randomNumber);

	const contractFunction = contractRouletteMANA.methods.play(
		walletAddress,
		landID,
		machineID,
		betIDs,
		betValues,
		betAmounts,
		randomNumber
	);
	const functionABI = contractFunction.encodeABI();

	contractFunction.estimateGas({ from: keys.WALLET_ADDRESS }).then((gasAmount) => {
		web3.eth.getTransactionCount(keys.WALLET_ADDRESS).then((_nonce) => {
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
					.once('transactionHash', (hash) => {
						console.log('TxHash: ', hash);
						txHash = hash;
					})
					.on('receipt', console.log);

				console.log('transaction complete');
				web3.eth.getTransactionReceipt(txHash).then(async (data) => {
					if (data.status) {
		              /////////////////////////////////////////////////////////////////////////////////////////
		              /////////////////////////////////////////////////////////////////////////////////////////
		              // write transaction data to mongoDB database

		              var allAmount = 0;
		              for (var i = 0; i < betAmounts.length; i++)
		              	allAmount += Number(betAmounts[i]);

		              try {
		                //store session DB
		                var playData = await dbMongo.insertPlayInfo({
		                  address: walletAddress,
		                  coinName: 'MANA,
		                  machineID: machineID,
		                  landID: landID,
		                  betAmount: allAmount,
		                  txid: txHash,
		                  type: 'Roulette'
		                });

		                if (playData) console.log('roulette playinfo storing success');
		                else console.log('roulette playinfo storing failed');

		                // store player DB
		                var playerData = await dbMongo.findPlayerInfo({
		                  address: walletAddress, type: 'Roulette'
		                });
		                var incFreePlay = allAmount > 0 ? 0 : 1;
		                var incPayoutPlay = allAmount > 0 ? 1 : 0;

		                if (playerData) {
		                  playerData = await dbMongo.updatePlayerInfo(
		                    { address: playerData.address, type: 'Roulette' },
		                    {
		                      totalBetAmount:
		                        Number(playerData.totalBetAmount) + Number(allAmount),
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
		                    totalBetAmount: allAmount,
		                    latestSessionDate: playData.createdAt,
		                    numberOfFreePlays: incFreePlay,
		                    numberOfPayoutPlays: incPayoutPlay,
		                    type: 'Roulette'
		                  });
		                }

		                if (playerData) console.log('roulette playerinfo storing success');
		                else console.log('roulette playerinfo storing failed');

		                // store machineDB
		                var machineData = await dbMongo.findMachineInfo({
		                  machineID: machineID,
		                  landID: landID,
		                  playerAddresse: walletAddress,
		                  type: 'Roulette'
		                });

		                if (!machineData) {
		                  machineData = await dbMongo.insertMachineInfo({
		                    machineID: machineID,
		                    landID: landID,
		                    playerAddresse: walletAddress,
		                    type: 'Roulette'
		                  });
		                }

		                if (machineData) console.log('roulette machineinfo storing success');
		                else console.log('roulette machineinfo storing failed');

		                // store machineTotalDB
		                var machineTotalData = await dbMongo.findMachineTotalInfo({
		                  machineID: machineID, type: 'Roulette'
		                });

		                if (!machineTotalData) {
		                  machineTotalData = await dbMongo.insertMachineTotalInfo({
		                    machineID: machineID,
		                    landID: landID,
		                    totalBetAmount: allAmount,
		                    latestSessionDate: playData.createdAt,
		                    type: 'Roulette'
		                  });
		                } else {
		                  machineTotalData = await dbMongo.updateMachineTotalInfo(
		                    { machineID: machineID, type: 'Roulette' },
		                    {
		                      totalBetAmount:
		                        Number(machineTotalData.totalBetAmount) +
		                        Number(allAmount),
		                      latestSessionDate: playData.createdAt
		                    }
		                  );

		                  if (machineTotalData)
			                console.log('roulette machinetotalinfo storing success');
			              else console.log('roulette machinetotalinfo storing failed');
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
