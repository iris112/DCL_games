const httpserver = require('http').createServer();
const express = require('express');
const force = require('express-force-domain');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const websocket = require('./modules/websocket.js');
const orderRouter = require('./routes/order-router');
const adminRouter = require('./routes/admin-router');
const dagger = require('./modules/dagger.js');

const PORT = process.env.PORT || 5000;
let server = express();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// NFT meta-data route
require('./routes/nft-router')(server);

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// set WebSocket instance and Matic Dagger provider
if (process.env.NODE_ENV === 'production') {
  // server.use(force('https://decentral.games')); // redirect all requests to https://decentral.games
  server.use(sslRedirect());

  // express will serve production assets
  server.use(express.static('client/build'), (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
  });

  new websocket({ server: httpserver });
} else {
  server.use(express.static('client/public'));
  new websocket({ port: 8080 });
}

dagger.setDagger();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
httpserver.on('request', server);
httpserver.listen(PORT, () => console.log(`Listening on ${PORT}`));
