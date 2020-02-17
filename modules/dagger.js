const Dagger = require('eth-dagger');
const keys = require('../config/keys');
const gameDataOut = require('./gameDataOut');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// we use Dagger to listen to events on Matic Network
module.exports.setDagger = () => {
	const dagger = new Dagger('wss://matic.dagger2.matic.network');

	// new log generated for parent contract address
	dagger.on('latest:log/' + keys.MASTER_PARENT_ADDRESS, async function(result) {
		console.log('event data received');

		gameDataOut.returnData(result);
	});
};
