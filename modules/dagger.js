const Dagger = require('eth-dagger');
const keys = require('../config/keys');
const slotsOut = require('./slotsOut');
const rouletteOut = require('./rouletteOut');

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// we use Dagger to listen to events on Matic Network
module.exports.setDagger = () => {
	const dagger = new Dagger('wss://matic.dagger2.matic.network');

	// new log generated for slots contract address
	dagger.on('latest:log/' + keys.SLOTS_MANA_ADDRESS, async function(result) {
		slotsOut.returnData(result);
	});

	// new log generated for roulette contract address
	dagger.on('latest:log/' + keys.ROULETTE_MANA_ADDRESS, async function(result) {
		rouletteOut.returnData(result);
	});
};
