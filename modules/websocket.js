const SocketServer = require('ws').Server;
const gameDataIn = require('./gameDataIn');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports = function WebSocket(server) {
	wss = new SocketServer(server); // create WebSocket connection and establish handshake

	// dummy data and transaction call for testing
	// const messageJSON = {
	// 	machineID: '001001005',
	// 	walletAddress: '0x1fcde174c13691ef0c13fcee042e0951452c0f8a',
	// 	gameData: {
	// 		coinName: 'MANA',
	// 		betIDs: [ 1101 ],
	// 		betValues: [ 0 ],
	// 		betAmounts: [ 10000000000000000000 ]
	// 	}
	// };
	// const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));
	// sleep(3000).then(() => {
	// 	gameDataIn.prepareTransaction(messageJSON);
	// });

	wss.on('connection', (ws) => {
		console.log('DCL client connected');
		ws.send('Hello Decentraland!');

		ws.on('close', () => console.log('DCL client disconnected'));

		/////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////////
		// handle incoming client-side play calls and send blockchain transactions
		ws.on('message', function incoming(message) {
			const messageJSON = JSON.parse(message);

			gameDataIn.prepareTransaction(messageJSON);
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
