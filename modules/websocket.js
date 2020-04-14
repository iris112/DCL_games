const SocketServer = require('ws').Server;
const dataTransaction = require('./dataTransaction');


/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports = function WebSocket(server) {
	wss = new SocketServer(server); // create WebSocket connection and establish handshake

	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	// dummy data and transaction call for testing and resetting tail hash on the smart contract
	// const messageJSON = {
	// 	machineID: '001001005',
	// 	walletAddress: '0x1fcde174c13691ef0c13fcee042e0951452c0f8a',
	// 	gameData: {
	// 		coinName: 'MANA',
	// 		betIDs: [ 1101 ],
	// 		betValues: [ 0 ],
	// 		betAmounts: [ 1 ]
	// 	}
	// };
	// dataTransaction.prepareTransaction(messageJSON);

	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
	}  

	function initTable(tableID) {
		global.clients[tableID] = [];
		global.addresses[tableID] = [];
		global.seconds[tableID] = {};
		global.chips[tableID] = [];
		global.bets[tableID] = [];
		global.mode[tableID] = '';
		global.seconds[tableID]["count"] = 15;
	}

	function removeClientFromTable(ws) {
		let removedBets = [];
		for (var id in global.clients) {
			let index = global.clients[id].indexOf(ws);
			if (index != -1) {
				global.clients[id].splice(index, 1);
				global.addresses[id].splice(index, 1);

				global.chips[id].forEach(item => {
					if (item.idx == index)
						removedBets.push(item.bet);
				});
				global.chips[id] = global.chips[id].filter(item => item.idx != index);

				global.chips[id] = global.chips[id].map(item => {
					if (item.idx > index)
						item.idx = item.idx - 1;
					return item;
				})

				let tmpJSON = {
					tableID: '',
					type: 'message',
					gameData: {}
				};
				tmpJSON.gameData["method"] = 'clear_chip';
				tmpJSON.gameData["removed_bets"] = removedBets;
				tmpJSON["tableID"] = id;
				
				global.clients[id].forEach(function each(client) {
					client.send(JSON.stringify(tmpJSON));
				});

				if (global.clients[id].length == 1) {
					tmpJSON.gameData["method"] = 'player_mode';
					tmpJSON.gameData["mode"] = 'single';
					delete tmpJSON.gameData.removed_bets;
					global.clients[id][0].send(JSON.stringify(tmpJSON));

					global.seconds[id]["count"] = 15;
					clearInterval(global.seconds[id]["id"]);
				} else if (global.clients[id].length == 0) {
					initTable(id);
				}
			}
		}
	}

	wss.on('connection', (ws) => {
		console.log('DCL client connected');
		ws.send('Hello Decentraland!');

		ws.on('close', () => console.log('DCL client disconnected'));

		/////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////////
		// handle incoming client-side play calls and send blockchain transactions
		ws.on('message', function incoming(message) {
			const messageJSON = JSON.parse(message);
			console.log(messageJSON);
			if (messageJSON.gameData.method == 'place_chip') {
				global.bets[messageJSON.tableID] = [];
				if (!global.chips[messageJSON.tableID] || global.chips[messageJSON.tableID].length == 0)
					global.chips[messageJSON.tableID] = [];
				global.chips[messageJSON.tableID].push({
					bet: messageJSON.gameData.bet,
					money_held: messageJSON.gameData.money_held,
					idx : global.clients[messageJSON.tableID].indexOf(ws)
				});

				global.clients[messageJSON.tableID].forEach(function each(client) {
					if (client != ws)
						client.send(JSON.stringify(messageJSON));
				});
			} else if (messageJSON.gameData.method == 'clear_chip')  {
				global.bets[messageJSON.tableID] = [];
				if (messageJSON.gameData.mode == 'all') {
					global.chips[messageJSON.tableID] = [];
					return;
				}
				if (global.chips[messageJSON.tableID]) {
					const idx = global.chips[messageJSON.tableID].findIndex(item => item.bet == messageJSON.gameData.bet);
					if (idx != -1)
						global.chips[messageJSON.tableID].splice(idx, 1);
				}

				global.clients[messageJSON.tableID].forEach(function each(client) {
					if (client != ws)
						client.send(JSON.stringify(messageJSON));
				});

			} else if (messageJSON.gameData.method == 'timer_start') {
				global.bets[messageJSON.tableID] = [];
				global.seconds[messageJSON.tableID]["count"] = 15;
				clearInterval(global.seconds[messageJSON.tableID]["id"]);
				global.seconds[messageJSON.tableID]["id"] = setInterval(() => {
					global.seconds[messageJSON.tableID]["count"]--;
					if (global.seconds[messageJSON.tableID]["count"] == -1) {
						clearInterval(global.seconds[messageJSON.tableID]["id"]);
						
						// send wheel_play requests to clients in the room
						messageJSON.gameData.method = 'wheel_play';
						if (global.chips[messageJSON.tableID].length == 0)
							messageJSON.gameData["stop_number"] = -1
						else
							messageJSON.gameData["stop_number"] = getRandomIntInclusive(0, 36);
						global.clients[messageJSON.tableID].forEach(function each(client) {
							client.send(JSON.stringify(messageJSON));
						});
						
						global.chips[messageJSON.tableID] = [];
						global.seconds[messageJSON.tableID] = {};
					}
				}, 1000);
				
				// send remaining seconds to newbies
				messageJSON.gameData["seconds"] = global.seconds[messageJSON.tableID]["count"];
				global.clients[messageJSON.tableID].forEach(function each(client) {
					client.send(JSON.stringify(messageJSON));
				});
			} else if (messageJSON.gameData.method == 'join_server') {
				global.bets[messageJSON.tableID] = [];
				// if there is nobody in the server
				if (!global.clients[messageJSON.tableID] || global.clients[messageJSON.tableID].length == 0) {
					initTable(messageJSON.tableID);
				}

				
				// remove duplicated clients and related chips
				removeClientFromTable(ws);

				// set remaining seconds to clients
				messageJSON.gameData["seconds"] = global.seconds[messageJSON.tableID]["count"];
				// add new user to the table
				if (global.clients[messageJSON.tableID].indexOf(ws) == -1) {
					global.clients[messageJSON.tableID].push(ws);
					global.addresses[messageJSON.tableID].push(messageJSON.walletAddress);
				}

				// send join notification to clients
				global.clients[messageJSON.tableID].forEach(function each(client) {
					if (client != ws)
						client.send(JSON.stringify(messageJSON));
				});
				messageJSON.gameData["bet_array"] = global.chips[messageJSON.tableID];
				messageJSON.gameData["user"] = 'me';
				ws.send(JSON.stringify(messageJSON));

				// send player_mode notification to clients
				if (global.clients[messageJSON.tableID].length == 1) {
					messageJSON.gameData["method"] = 'player_mode';
					messageJSON.gameData["mode"] = 'single';
					delete messageJSON.gameData.bet_array;
					delete messageJSON.gameData.seconds;
					global.clients[messageJSON.tableID][0].send(JSON.stringify(messageJSON));
				} else {
					messageJSON.gameData["method"] = 'player_mode';
					messageJSON.gameData["mode"] = 'multi';
					delete messageJSON.gameData.bet_array;
					delete messageJSON.gameData.seconds;

					global.clients[messageJSON.tableID].forEach(function each(client) {
						client.send(JSON.stringify(messageJSON));
					});
				}
			} else if (messageJSON.gameData.method == 'payment_mode') {
				if (global.clients[messageJSON.tableID].length > 1) {
					if (global.mode[messageJSON.tableID] != messageJSON.gameData["mode"]) {
						if (messageJSON.gameData["mode"] == 'MANA') {
							global.mode[messageJSON.tableID] = 'MANA';
							global.clients[messageJSON.tableID].forEach(function each(client) {
								if (client != ws){
									console.log("changing mode");
									client.send(JSON.stringify(messageJSON));
								}
							});	
						} else if (messageJSON.gameData["mode"] == 'PLAY') {
							global.mode[messageJSON.tableID] = 'MANA';
							messageJSON.gameData["mode"] = 'MANA';
							ws.send(JSON.stringify(messageJSON));
						}
					}
				} else {
					global.mode[messageJSON.tableID] = messageJSON.gameData["mode"];
				}
			} else {
				if (!global.bets[messageJSON.tableID])
					global.bets[messageJSON.tableID] = [];
				global.bets[messageJSON.tableID].push(messageJSON);

				if (global.bets[messageJSON.tableID].length == global.clients[messageJSON.tableID].length) {
					let _messageJSON = {
						machineID : global.bets[messageJSON.tableID][0].machineID,
						walletAddress : [],
						gameData : {
							coinName : global.bets[messageJSON.tableID][0].gameData.coinName,
							betIDs : [],
							betValues : [],
							betAmounts : []
						},
						dbData : {
							_betAmounts : [],
							_walletAddress : []
						}
					};
					global.bets[messageJSON.tableID].forEach(bet => {
						_messageJSON.dbData._walletAddress.push(bet.walletAddress);
						_messageJSON.dbData._betAmounts.push(bet.gameData.betAmounts);
						for (let i = 0 ; i < bet.gameData.betIDs.length ; i ++){
							_messageJSON.walletAddress.push(bet.walletAddress);
							_messageJSON.gameData.betIDs.push(bet.gameData.betIDs[i]);
							_messageJSON.gameData.betValues.push(bet.gameData.betValues[i]);
							_messageJSON.gameData.betAmounts.push(bet.gameData.betAmounts[i]);
						}
					});
					dataTransaction.prepareTransaction(_messageJSON);
				}
			}
		});

		ws.on('close', function() {
			console.log('disconnect');
			removeClientFromTable(ws);
		});
	});

	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	// send ping once per 10 seconds for client sync features (and to keep connection open on Heroku)
	setInterval(() => {
		wss.clients.forEach((client) => {
			client.send(new Date().toTimeString());
		});
	}, 10000);
};
