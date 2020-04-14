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
	let walletAddress = messageJSON.walletAddress;
	const coinName = messageJSON.gameData.coinName;
	let betIDs = messageJSON.gameData.betIDs;
	let betValues = messageJSON.gameData.betValues;
	let betAmounts = messageJSON.gameData.betAmounts;

	// walletAddress.push('0x4B10a68212441341dC03143AD3D5091bf3D2AA1B');
	// betIDs.push(3309);
	// betValues.push(1);
	// betAmounts.push('1000000000000000000');
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

	try {
		const gasAmount = await contractFunction.estimateGas({ from: keys.WALLET_ADDRESS });
		web3.eth.getTransactionCount(keys.WALLET_ADDRESS).then((_nonce) => {
			console.log('nonce: ' + _nonce);
			const gasMultiple = Math.min(Math.floor(gasAmount * 1.5), 8000000);
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
					gasPrice: web3.utils.toHex(10000000000),
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

						const _walletAddress = messageJSON.dbData._walletAddress;
						const _betAmounts = messageJSON.dbData._betAmounts;
						for (var k = 0 ; k < _walletAddress.length ; k ++) {
							var allAmount = 0;
							for (var i = 0; i < _betAmounts[k].length; i++) allAmount += Number(_betAmounts[k][i]);
							try {
								//store session DB
								var playData = await dbMongo.insertPlayInfo({
									address: _walletAddress[k],
									coinName: coinName,
									machineID: machineID,
									landID: landID,
									betAmount: allAmount,
									txid: txHash,
									gameType: gameType
								});
								if (playData) console.log('game play info storing success');
								else console.log('game play info storing failed');
								// store player DB
								var playerData = await dbMongo.findPlayerInfo({
									address: _walletAddress[k],
									gameType: gameType
								});
								var incFreePlay = allAmount > 0 ? 0 : 1;
								var incPayoutPlay = allAmount > 0 ? 1 : 0;
								if (playerData) {
									playerData = await dbMongo.updatePlayerInfo(
										{ address: playerData.address, gameType: gameType },
										{
											totalBetAmount: Number(playerData.totalBetAmount) + Number(allAmount),
											latestSessionDate: playData.createdAt,
											numberOfFreePlays: Number(playerData.numberOfFreePlays) + incFreePlay,
											numberOfPayoutPlays: Number(playerData.numberOfPayoutPlays) + incPayoutPlay
										}
									);
								} else {
									playerData = await dbMongo.insertPlayerInfo({
										address: _walletAddress[k],
										totalBetAmount: allAmount,
										latestSessionDate: playData.createdAt,
										numberOfFreePlays: incFreePlay,
										numberOfPayoutPlays: incPayoutPlay,
										gameType: gameType
									});
								}
								if (playerData) console.log('game player info storing success');
								else console.log('game player info storing failed');
								// store machineDB
								var machineData = await dbMongo.findMachineInfo({
									machineID: machineID,
									playerAddresse: _walletAddress[k],
									gameType: gameType
								});
								if (!machineData) {
									machineData = await dbMongo.insertMachineInfo({
										machineID: machineID,
										landID: landID,
										playerAddresse: _walletAddress[k],
										totalBetAmount: allAmount,
										latestSessionDate: playData.createdAt,
										gameType: gameType
									});
								} else {
									machineData = await dbMongo.updateMachineInfo(
										{ machineID: machineID, playerAddresse: _walletAddress[k], gameType: gameType },
										{
											totalBetAmount: Number(machineData.totalBetAmount) + Number(allAmount),
											latestSessionDate: playData.createdAt
										}
									);
								}
								if (machineData) console.log('game machine info storing success');
								else console.log('game machine info storing failed');
								// store machineTotalDB
								var machineTotalData = await dbMongo.findMachineTotalInfo({
									machineID: machineID,
									gameType: gameType
								});
								if (!machineTotalData) {
									machineTotalData = await dbMongo.insertMachineTotalInfo({
										machineID: machineID,
										landID: landID,
										totalBetAmount: allAmount,
										latestSessionDate: playData.createdAt,
										gameType: gameType
									});
								} else {
									machineTotalData = await dbMongo.updateMachineTotalInfo(
										{ machineID: machineID, gameType: gameType },
										{
											totalBetAmount: Number(machineTotalData.totalBetAmount) + Number(allAmount),
											latestSessionDate: playData.createdAt
										}
									);
									if (machineTotalData) console.log('game machine total info storing success');
									else console.log('game machine total info storing failed');
								}
							} catch (e) {
								console.log(e);
							}
						}
					}
				});
			};

			sendTransaction();
		});
	} catch (e) {
		console.log(e);
	}
};
