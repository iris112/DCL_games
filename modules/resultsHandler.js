const dbMongo = require('../db/dbMongo');

dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.returnData = async (result) => {
	// console.log(result);

	let address = [];
	let array_cnt = parseInt(result[0].data.slice(194, 258), 16); 
	if (array_cnt > 0) {
		const first_addr = '0x' + result[0].data.slice(258, 322).slice(24);
		for (var id in global.addresses) {
			let index = global.addresses[id].indexOf(first_addr);
			if (index != -1) {
				address = global.addresses[id];
				break;
			}
		}
	}

	const numbers = parseInt(result[0].topics[2], 16);

	let amount = [];
	let amount_cnt = parseInt(result[0].data.slice((array_cnt + 4) * 64 + 2, (array_cnt + 5) * 64 + 2), 16); 

	for (let i = 0 ; i < amount_cnt ; i ++) {
		amount.push(parseInt(result[0].data.slice((array_cnt + i + 5) * 64 + 2, (array_cnt + i + 6) * 64 + 2).slice(16)));
	}

	console.log('wallet address: ' + address + ', wheel numbers: ' + numbers + ', win amount: ' + amount);

	const spinObj = {
		_address: address,
		_numbers: numbers,
		_amountWin: amount
	};
	const json = JSON.stringify({ type: 'blockchain', data: spinObj });

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
		for (var i = 0 ; i < address.length ; i ++) {
			// update session DB
			var playData = await dbMongo.findPlayInfo({
				txid: result[0].transactionHash,
				address: address[i]
			});
			if (!playData) {
				console.log("can't find game play info : txid = ", result[0].transactionHash);
				return;
			} else {
				playData = await dbMongo.updatePlayInfo(playData, {
					number: numbers,
					amountWin: amount[i]
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
						totalAmountWin: Number(playerData.totalAmountWin) + amount[i]
					}
				);
				if (playerData) console.log('game player info updating success');
				else console.log('game player info updating failed');
			} else {
				console.log("can't find game player info : address = " + playData.address);
			}

			// update machine DB
			var machineData = await dbMongo.findMachineInfo({
				machineID: playData.machineID,
				playerAddresse: playData.address,
				gameType: gameType
			});

			if (machineData) {
				machineData = await dbMongo.updateMachineInfo(
					{ machineID: playData.machineID, playerAddresse: playData.address, gameType: playData.gameType },
					{
						totalAmountWin: Number(machineData.totalAmountWin) + amount[i]
					}
				);
				if (machineData) console.log('game machine info updating success');
				else console.log('game machine info updating failed');
			} else {
				console.log("can't find game machine info : machineID = " + playData.machineID + ", address = " + playData.address);
			}

			// update machine Total DB
			const machineTotalData = await dbMongo.findMachineTotalInfo({
				machineID: playData.machineID,
				gameType: playData.gameType
			});

			if (machineTotalData) {
				machineTotalData = await dbMongo.updateMachineTotalInfo(
					{ machineID: playData.machineID, gameType: playData.gameType },
					{
						totalAmountWin: Number(machineTotalData.totalAmountWin) + amount[i]
					}
				);
				if (machineTotalData) console.log('game machine total info updating success');
				else console.log('game machine total info updating failed');
			} else {
				console.log("can't find game machine total info : machineID = " + playData.machineID);
			}
		}
	} catch (e) {
		console.log(e);
	}
};
