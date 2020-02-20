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

	contractMasterParent = await getContractInstance(ABIMasterParent, keys.MASTER_PARENT_ADDRESS);
}
setProviderAndInstance();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.prepareTransaction = async (messageJSON) => {
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

	console.log('hash: ' + hash);
	console.log('coin name: ' + coinName);

	const contractFunction = contractMasterParent.methods.play(
		gameType,
		walletAddress,
		landID,
		machineID,
		betIDs,
		betValues,
		betAmounts,
		hash,
		coinName
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
					.once('transactionHash', (hash) => {
						console.log('TxHash: ', hash);
						txHash = hash;
					})
					.on('receipt');

				console.log('transaction complete');

				web3.eth.getTransactionReceipt(txHash).then(async (data) => {
					if (data.status) {
						/////////////////////////////////////////////////////////////////////////////////////////
						/////////////////////////////////////////////////////////////////////////////////////////
						// write transaction data to mongoDB database
						// var allAmount = 0;
						// for (var i = 0; i < betAmounts.length; i++) allAmount += Number(betAmounts[i]);
						// try {
						// 	//store session DB
						// 	var playData = await dbMongo.insertPlayInfo({
						// 		address: walletAddress,
						// 		coinName: coinName,
						// 		machineID: machineID,
						// 		landID: landID,
						// 		betAmount: allAmount,
						// 		txid: txHash,
						// 		type: gameTypeStr
						// 	});
						// 	if (playData) console.log('game play info storing success');
						// 	else console.log('game play info storing failed');
						// 	// store player DB
						// 	var playerData = await dbMongo.findPlayerInfo({
						// 		address: walletAddress,
						// 		type: gameTypeStr
						// 	});
						// 	var incFreePlay = allAmount > 0 ? 0 : 1;
						// 	var incPayoutPlay = allAmount > 0 ? 1 : 0;
						// 	if (playerData) {
						// 		playerData = await dbMongo.updatePlayerInfo(
						// 			{ address: playerData.address, type: gameTypeStr },
						// 			{
						// 				totalBetAmount: Number(playerData.totalBetAmount) + Number(allAmount),
						// 				latestSessionDate: playData.createdAt,
						// 				numberOfFreePlays: Number(playerData.numberOfFreePlays) + incFreePlay,
						// 				numberOfPayoutPlays: Number(playerData.numberOfPayoutPlays) + incPayoutPlay
						// 			}
						// 		);
						// 	} else {
						// 		playerData = await dbMongo.insertPlayerInfo({
						// 			address: walletAddress,
						// 			totalBetAmount: allAmount,
						// 			latestSessionDate: playData.createdAt,
						// 			numberOfFreePlays: incFreePlay,
						// 			numberOfPayoutPlays: incPayoutPlay,
						// 			type: gameTypeStr
						// 		});
						// 	}
						// 	if (playerData) console.log('game player info storing success');
						// 	else console.log('game player info storing failed');
						// 	// store machineDB
						// 	var machineData = await dbMongo.findMachineInfo({
						// 		machineID: machineID,
						// 		landID: landID,
						// 		playerAddresse: walletAddress,
						// 		type: gameTypeStr
						// 	});
						// 	if (!machineData) {
						// 		machineData = await dbMongo.insertMachineInfo({
						// 			machineID: machineID,
						// 			landID: landID,
						// 			playerAddresse: walletAddress,
						// 			type: gameTypeStr
						// 		});
						// 	}
						// 	if (machineData) console.log('game machine info storing success');
						// 	else console.log('game machine info storing failed');
						// 	// store machineTotalDB
						// 	var machineTotalData = await dbMongo.findMachineTotalInfo({
						// 		machineID: machineID,
						// 		type: gameTypeStr
						// 	});
						// 	if (!machineTotalData) {
						// 		machineTotalData = await dbMongo.insertMachineTotalInfo({
						// 			machineID: machineID,
						// 			landID: landID,
						// 			totalBetAmount: allAmount,
						// 			latestSessionDate: playData.createdAt,
						// 			type: gameTypeStr
						// 		});
						// 	} else {
						// 		machineTotalData = await dbMongo.updateMachineTotalInfo(
						// 			{ machineID: machineID, type: gameTypeStr },
						// 			{
						// 				totalBetAmount: Number(machineTotalData.totalBetAmount) + Number(allAmount),
						// 				latestSessionDate: playData.createdAt
						// 			}
						// 		);
						// 		if (machineTotalData) console.log('game machine total info storing success');
						// 		else console.log('game machine total info storing failed');
						// 	}
						// } catch (e) {
						// 	console.log(e);
						// }
					}
				});
			};

			sendTransaction();
		});
	});
};
