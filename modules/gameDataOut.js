const dbMongo = require('../db/dbMongo');

dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.returnData = async (result) => {
	// console.log(result);

	const address = result[0].topics[1].slice(0, 25);
	const numbers = parseInt(result[0].topics[2], 16);
	const amount = parseInt(result[0].topics[3], 16);

	console.log('wallet address: ' + address + ', wheel numbers: ' + numbers + ', win amount: ' + amount);

	const spinObj = {
		_address: address,
		_numbers: numbers,
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
	// try {
	// 	// update session DB
	// 	const playData = await dbMongo.findPlayInfo({
	// 		machineID: machineIDPadded,
	// 		type: gameTypeStr,
	// 		txid: result[0].transactionHash
	// 	});
	// 	if (!playData) {
	// 		console.log(
	// 			"can't find game play info : machinID = " + machineIDPadded,
	// 			' txid = ',
	// 			result[0].transactionHash
	// 		);
	// 		return;
	// 	} else {
	// 		playData = await dbMongo.updatePlayInfo(playData, {
	// 			number: numbers,
	// 			amountWin: amount
	// 		});
	// 		if (playData) console.log('game play info updating success');
	// 		else console.log('game play info updating failed');
	// 	}

	// 	// update player DB
	// 	const playerData = await dbMongo.findPlayerInfo({
	// 		address: playData.address,
	// 		type: gameTypeStr
	// 	});

	// 	if (playerData) {
	// 		playerData = await dbMongo.updatePlayerInfo(
	// 			{ address: playerData.address, type: gameTypeStr },
	// 			{
	// 				totalAmountWin: Number(playerData.totalAmountWin) + amount
	// 			}
	// 		);
	// 		if (playerData) console.log('game player info updating success');
	// 		else console.log('game player info updating failed');
	// 	} else {
	// 		console.log("can't find game player info : address = " + playData.address);
	// 	}

	// 	// update machine Total DB
	// 	const machineTotalData = await dbMongo.findMachineTotalInfo({
	// 		machineID: machineIDPadded,
	// 		type: gameTypeStr
	// 	});

	// 	if (machineTotalData) {
	// 		machineTotalData = await dbMongo.updateMachineTotalInfo(
	// 			{ machineID: machineIDPadded, type: gameTypeStr },
	// 			{
	// 				totalAmountWin: Number(machineTotalData.totalAmountWin) + amount
	// 			}
	// 		);
	// 		if (machineTotalData) console.log('game machine total info updating success');
	// 		else console.log('game machine total info updating failed');
	// 	} else {
	// 		console.log("can't find game machine total info : machineID = " + machineIDPadded);
	// 	}
	// } catch (e) {
	// 	console.log(e);
	// }
};
