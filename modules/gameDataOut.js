const dbMongo = require('../db/dbMongo');

dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// web3 removes leading zeros, let's put them back
function padding(number, size) {
	let numberString = number.toString();

	while (numberString.length < size) numberString = '0' + numberString;

	return numberString;
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.returnData = async (result) => {
	// console.log(result);

	const numbers = parseInt(result[0].topics[1], 16);
	const machineID = parseInt(result[0].topics[2], 16);
	const machineIDPadded = padding(machineID, 9);
	const gameType = machineIDPadded.slice(3, 6);
	const amount = parseInt(result[0].topics[3], 16);

	const gameTypeStr = gameType == 1 ? 'Slots' : 'Roulette';

	console.log('wheel numbers: ' + numbers + ', machine id: ' + machineIDPadded + ', win amount: ' + amount);

	const spinObj = {
		_numbers: numbers,
		_machineID: machineIDPadded,
		_amountWin: amount
	};
	const json = JSON.stringify({ type: 'message', data: spinObj });

	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	// notify each client of new spin result
	wss.clients.forEach((client) => {
		client.send(json);
	});

	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	// write event data to MongoDB database
	try {
		// update session DB
		const playData = await dbMongo.findPlayInfo({
			machineID: machineIDPadded,
			type: gameTypeStr,
			txid: result[0].transactionHash
		});
		if (!playData) {
			console.log(
				"can't find game play info : machinID = " + machineIDPadded,
				' txid = ',
				result[0].transactionHash
			);
			return;
		} else {
			playData = await dbMongo.updatePlayInfo(playData, {
				number: numbers,
				amountWin: amount
			});
			if (playData) console.log('game play info updating success');
			else console.log('game play info updating failed');
		}

		// update player DB
		const playerData = await dbMongo.findPlayerInfo({
			address: playData.address,
			type: gameTypeStr
		});

		if (playerData) {
			playerData = await dbMongo.updatePlayerInfo(
				{ address: playerData.address, type: gameTypeStr },
				{
					totalAmountWin: Number(playerData.totalAmountWin) + amount
				}
			);
			if (playerData) console.log('game player info updating success');
			else console.log('game player info updating failed');
		} else {
			console.log("can't find game player info : address = " + playData.address);
		}

		// update machine Total DB
		const machineTotalData = await dbMongo.findMachineTotalInfo({
			machineID: machineIDPadded,
			type: gameTypeStr
		});

		if (machineTotalData) {
			machineTotalData = await dbMongo.updateMachineTotalInfo(
				{ machineID: machineIDPadded, type: gameTypeStr },
				{
					totalAmountWin: Number(machineTotalData.totalAmountWin) + amount
				}
			);
			if (machineTotalData) console.log('game machine total info updating success');
			else console.log('game machine total info updating failed');
		} else {
			console.log("can't find game machine total info : machineID = " + machineIDPadded);
		}
	} catch (e) {
		console.log(e);
	}
};
