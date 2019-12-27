const SocketServer = require('ws').Server;
const slotsIn = require('./slotsIn');
const rouletteIn = require('./rouletteIn');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports = function WebSocket(server) {
  wss = new SocketServer(server); // create WebSocket connection and establish handshake

  wss.on('connection', ws => {
    console.log('DCL client connected');
    ws.send('Hello Decentraland!');

    ws.on('close', () => console.log('DCL client disconnected'));

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // handle incoming client-side play calls and send blockchain transactions
    ws.on('message', function incoming(message) {
      // console.log('gameplay message: ' + message);

      const messageJSON = JSON.parse(message);

      // get the game type from the machine ID
      const machineID = messageJSON.machineID;
      const gameType = machineID.slice(3, 6);
      console.log('game type: ' + gameType);

      if (gameType == '001') {
        slotsIn.prepareTransaction(messageJSON);
      } else if (gameType == '002') {
        rouletteIn.prepareTransaction(messageJSON);
      } else if (gameType == '003') {
        // backgammonIn.prepareTransaction(messageJSON);
      }
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // send pings once every 10 seconds to keep connection open on Heroku
  setInterval(() => {
    wss.clients.forEach(client => {
      client.send(new Date().toTimeString());
    });
  }, 10000);
};
