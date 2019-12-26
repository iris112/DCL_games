const express = require('express');
const force = require('express-force-domain');
const httpserver = require('http').createServer();
const sslRedirect = require('heroku-ssl-redirect');
const SocketServer = require('ws').Server;
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const Dagger = require('eth-dagger');
const bodyParser = require('body-parser');
const orderRouter = require('./routes/order-router');
const adminRouter = require('./routes/admin-router');
const dbMongo = require('./db/dbMongo');
const keys = require('./config/keys');
const ABISlotsMANA = require('./ethereum/contracts/slots/ABISlotsMANA');
const dbNFT = require('./db/dbNFT');

dbMongo.initDb();
const PORT = process.env.PORT || 5000;
let server = express();
let wss;

server.use(
  bodyParser.urlencoded({
    extended: true
  })
);
server.use(bodyParser.json());
server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
server.use('/order', orderRouter);
server.use('/admin', adminRouter);

// route for vehicles NFT metadata request
server.get('/nft/vehicle/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const vehicle = dbNFT[tokenId];

  const data = {
    name: vehicle.name,
    external_url: vehicle.external_url,
    image: vehicle.image,
    background_color: vehicle.background_color,
    attributes: [
      {
        trait_type: vehicle.attributes[0][1].trait_type,
        value: vehicle.attributes[0][1].value
      },
      {
        trait_type: vehicle.attributes[0][2].trait_type,
        value: vehicle.attributes[0][2].value
      },
      {
        trait_type: vehicle.attributes[0][3].trait_type,
        value: vehicle.attributes[0][3].value
      },
      {
        display_type: vehicle.attributes[0][4].display_type,
        trait_type: vehicle.attributes[0][4].trait_type,
        value: vehicle.attributes[0][4].value,
        max_value: vehicle.attributes[0][4].max_value
      },
      {
        display_type: vehicle.attributes[0][5].display_type,
        trait_type: vehicle.attributes[0][5].trait_type,
        value: vehicle.attributes[0][5].value,
        max_value: vehicle.attributes[0][5].max_value
      },
      {
        display_type: vehicle.attributes[0][6].display_type,
        trait_type: vehicle.attributes[0][6].trait_type,
        value: vehicle.attributes[0][6].value,
        max_value: vehicle.attributes[0][6].max_value
      },
      {
        display_type: vehicle.attributes[0][7].display_type,
        trait_type: vehicle.attributes[0][7].trait_type,
        value: vehicle.attributes[0][7].value,
        max_value: vehicle.attributes[0][7].max_value
      },
      {
        display_type: vehicle.attributes[0][8].display_type,
        trait_type: vehicle.attributes[0][8].trait_type,
        value: vehicle.attributes[0][8].value,
        max_value: vehicle.attributes[0][8].max_value
      }
    ]
  };

  res.send(data);
});

if (process.env.NODE_ENV === 'production') {
  // server.use(force('https://decentral.games')); // redirect all requests to https://decentral.games
  server.use(sslRedirect());

  // express will serve production assets
  server.use(express.static('client/build'), (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
  });

  wss = new SocketServer({ server: httpserver }); // create WebSocket connection and establish handshake
  setDagger(); // set Matic WebSocket provider
} else {
  // server.use(force('https://decentral.games')); // redirect all requests to https://decentral.games
  server.use(sslRedirect());

  // express will serve production assets
  server.use(express.static('client/build'), (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
  });

  wss = new SocketServer({ server: httpserver }); // create WebSocket connection and establish handshake
  setDagger(); // set Matic WebSocket provider
}

httpserver.on('request', server);
httpserver.listen(PORT, () => console.log(`Listening on ${PORT}`));

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// WebSocket message handlers and smart contract transaction call
// 'https://testnet2.matic.network','https://ropsten.infura.io/v3/78b439fd7ce943889dbd895c93b408e4';
const testnet = 'https://testnet2.matic.network';
// const testnet = 'https://beta.matic.network';
web3 = new Web3(new Web3.providers.HttpProvider(testnet));
const privateKey = Buffer.from(keys.WALLET_PRIVATE_KEY, 'hex');
let contractSlotsMANA = '';
web3.eth.defaultAccount = keys.WALLET_ADDRESS;

const contractInstance = async () => {
  contractSlotsMANA = await new web3.eth.Contract(
    ABISlotsMANA,
    keys.SLOTS_MANA_ADDRESS,
    {
      from: keys.WALLET_ADDRESS, // default from address
      gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    }
  );

  const getWallet = await contractSlotsMANA.methods.ceoAddress().call();
  console.log('CEO address (only allowed)): ' + getWallet);
  console.log('server wallet address: ' + keys.WALLET_ADDRESS);
  console.log('slots MANA contract address: ' + keys.SLOTS_MANA_ADDRESS);
};

contractInstance();

wss.on('connection', ws => {
  console.log('DCL client connected');
  ws.send('Hello Decentraland!');

  ws.on('close', () => console.log('DCL client disconnected'));

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle incoming client-side play calls and send blockchain transactions
  ws.on('message', function incoming(message) {
    const sendTransaction = async () => {
      console.log('gameplay message: ' + message);

      let messageJSON = JSON.parse(message);
      console.log('coin: ' + messageJSON.coin);
      console.log('wallet address: ' + messageJSON.walletAddress);
      console.log('bet amount: ' + messageJSON.betAmount);
      console.log('machine ID: ' + messageJSON.machineID);
      console.log('land ID: ' + messageJSON.landID);

      const randomNumber = Math.ceil(Math.random() * 10000);

      const contractFunction = contractSlotsMANA.methods.play(
        messageJSON.walletAddress,
        messageJSON.landID,
        messageJSON.betAmount,
        messageJSON.machineID,
        randomNumber
      );
      const functionABI = contractFunction.encodeABI();

      contractFunction
        .estimateGas({ from: keys.WALLET_ADDRESS })
        .then(gasAmount => {
          web3.eth.getTransactionCount(keys.WALLET_ADDRESS).then(_nonce => {
            console.log('nonce: ' + _nonce);
            const gasMultiple = Math.floor(gasAmount * 1.5);
            console.log('gas amount * 1.5: ' + gasMultiple);

            const customCommon = Common.forCustomChain(
              'mainnet',
              // {
              //   name: 'matic-testnet2',
              //   networkId: 8995,
              //   chainId: 8995
              // },
              {
                name: 'beta',
                networkId: 15001,
                chainId: 15001
              },
              'petersburg'
            );
            const tx = new Tx(
              {
                gasPrice: web3.utils.toHex(20000000000),
                gasLimit: web3.utils.toHex(gasMultiple),
                to: contractSlotsMANA.options.address,
                data: functionABI,
                from: keys.WALLET_ADDRESS,
                nonce: web3.utils.toHex(_nonce)
              },
              { common: customCommon }
            );

            tx.sign(privateKey);
            const serializedTx = tx.serialize();

            const sendTransaction = async () => {
              var txHash;
              result = await web3.eth
                .sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .once('transactionHash', hash => {
                  console.log('TxHash: ', hash);
                  txHash = hash;
                })
                .on('receipt', console.log);

              console.log('transaction complete');
              web3.eth.getTransactionReceipt(txHash).then(async data => {
                if (data.status) {
                  //store DB
                  try {
                    //store session DB
                    var playData = await dbMongo.insertPlayInfo({
                      address: messageJSON.walletAddress,
                      coinName: messageJSON.coin,
                      machineID: messageJSON.machineID,
                      landID: messageJSON.landID,
                      betAmount: messageJSON.betAmount,
                      txid: txHash
                    });

                    if (playData) console.log('playinfo storing success');
                    else console.log('playinfo storing failed');

                    //store player DB
                    var playerData = await dbMongo.findPlayerInfo({
                      address: messageJSON.walletAddress
                    });
                    var incFreePlay = messageJSON.betAmount > 0 ? 0 : 1;
                    var incPayoutPlay = messageJSON.betAmount > 0 ? 1 : 0;

                    if (playerData) {
                      playerData = await dbMongo.updatePlayerInfo(
                        { address: playerData.address },
                        {
                          totalBetAmount:
                            Number(playerData.totalBetAmount) +
                            Number(messageJSON.betAmount),
                          latestSessionDate: playData.createdAt,
                          numberOfFreePlays:
                            Number(playerData.numberOfFreePlays) + incFreePlay,
                          numberOfPayoutPlays:
                            Number(playerData.numberOfPayoutPlays) +
                            incPayoutPlay
                        }
                      );
                    } else {
                      playerData = await dbMongo.insertPlayerInfo({
                        address: messageJSON.walletAddress,
                        totalBetAmount: messageJSON.betAmount,
                        latestSessionDate: playData.createdAt,
                        numberOfFreePlays: incFreePlay,
                        numberOfPayoutPlays: incPayoutPlay
                      });
                    }

                    if (playerData) console.log('playerinfo storing success');
                    else console.log('playerinfo storing failed');

                    //store machineDB
                    var machineData = await dbMongo.findMachineInfo({
                      machineID: messageJSON.machineID,
                      landID: messageJSON.landID,
                      playerAddresse: messageJSON.walletAddress
                    });

                    if (!machineData) {
                      machineData = await dbMongo.insertMachineInfo({
                        machineID: messageJSON.machineID,
                        landID: messageJSON.landID,
                        playerAddresse: messageJSON.walletAddress
                      });
                    }

                    if (machineData) console.log('machineinfo storing success');
                    else console.log('machineinfo storing failed');

                    //store machineTotalDB
                    var machineTotalData = await dbMongo.findMachineTotalInfo({
                      machineID: messageJSON.machineID
                    });

                    if (!machineTotalData) {
                      machineTotalData = await dbMongo.insertMachineTotalInfo({
                        machineID: messageJSON.machineID,
                        landID: messageJSON.landID,
                        totalBetAmount: messageJSON.betAmount,
                        latestSessionDate: playData.createdAt
                      });
                    } else {
                      await dbMongo.updateMachineTotalInfo(
                        { machineID: messageJSON.machineID },
                        {
                          totalBetAmount:
                            Number(machineTotalData.totalBetAmount) +
                            Number(messageJSON.betAmount),
                          latestSessionDate: playData.createdAt
                        }
                      );
                    }

                    if (machineTotalData)
                      console.log('machinetotalinfo storing success');
                    else console.log('machinetotalinfo storing failed');
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

    sendTransaction();
  });
});

wss.broadcast = function broadcast(message) {
  wss.clients.forEach(function each(client) {
    console.log('sending CLIENT');

    if (
      client.readyState === WebSocket.OPEN &&
      client.addr === message.address
    ) {
      client.send(message.data);
    }
  });
};

// send pings once every 10 seconds to keep connection open on Heroku
setInterval(() => {
  wss.clients.forEach(client => {
    client.send(new Date().toTimeString());
  });
}, 10000);

function setDagger() {
  // connect to Dagger ETH matic network over web socket
  const dagger = new Dagger('wss://matic.dagger2.matic.network');

  // new log generated for our contract address
  dagger.on('latest:log/' + keys.SLOTS_MANA_ADDRESS, async function (result) {
    const numbers = parseInt(result[0].topics[1], 16);
    const machineID = parseInt(result[0].topics[2], 16);
    const amount = parseInt(result[0].topics[3], 16);

    console.log(
      'wheels numbers: ' + numbers,
      'machine id: ' + machineID,
      'win amount: ' + amount
    );

    const spinObj = {
      _numbers: numbers,
      _machineID: machineID,
      _amountWin: amount
    };
    const json = JSON.stringify({ type: 'message', data: spinObj });

    // notify each client of new spin result
    wss.clients.forEach(client => {
      client.send(json);
    });

    try {
      //update session DB
      var playData = await dbMongo.findPlayInfo({ machineID });
      if (!playData) {
        console.log("can't find play info : machinID = " + machinID);
        return;
      } else {
        playData = await dbMongo.updatePlayInfo(playData, {
          number: numbers,
          amountWin: amount
        });
        if (playData) console.log('playinfo updating success');
        else console.log('playinfo updating failed');
      }

      //update player DB
      var playerData = await dbMongo.findPlayerInfo({
        address: playData.address
      });

      if (playerData) {
        playerData = await dbMongo.updatePlayerInfo(
          { address: playerData.address },
          {
            totalAmountWin: Number(playerData.totalAmountWin) + amount
          }
        );
        if (playerData) console.log('playerinfo updating success');
        else console.log('playerinfo updating failed');
      } else {
        console.log("can't find player info : address = " + playData.address);
      }

      //update machine Total DB
      var machineTotalData = await dbMongo.findMachineTotalInfo({ machineID });

      if (machineTotalData) {
        machineTotalData = await dbMongo.updateMachineTotalInfo(
          { machineID },
          {
            totalAmountWin: Number(machineTotalData.totalAmountWin) + amount
          }
        );
        if (machineTotalData) console.log('machinetotalinfo updating success');
        else console.log('machinetotalinfo updating failed');
      } else {
        console.log("can't find machine total info : machineID = " + machineID);
      }
    } catch (e) {
      console.log(e);
    }
  });
}
