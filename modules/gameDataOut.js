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
	try {
		// update session DB
		var playData = await dbMongo.findPlayInfo({
			txid: result[0].transactionHash
		});
		if (!playData) {
			console.log("can't find game play info : txid = ", result[0].transactionHash);
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
		var playerData = await dbMongo.findPlayerInfo({
			address: playData.address,
			gameType: playData.gameType
		});

		if (playerData) {
			playerData = await dbMongo.updatePlayerInfo(
				{ address: playerData.address, gameType: playData.gameType },
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
			machineID: playData.machineID,
			address: playData.address,
			gameType: playData.gameType
		});

		if (machineTotalData) {
			machineTotalData = await dbMongo.updateMachineTotalInfo(
				{ machineID: playData.machineID, address: playData.address, gameType: playData.gameType },
				{
					totalAmountWin: Number(machineTotalData.totalAmountWin) + amount
				}
			);
			if (machineTotalData) console.log('game machine total info updating success');
			else console.log('game machine total info updating failed');
		} else {
			console.log("can't find game machine total info : machineID = " + playData.machineID);
		}
	} catch (e) {
		console.log(e);
	}
};
