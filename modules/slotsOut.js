const dbMongo = require('../db/dbMongo');

dbMongo.initDb();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// web3 removes leading zeros, let's put them back
function padding(number, size) {
  let numberString = number.toString();

  while (numberString.length < size) numberString = '0' + numberString;

  return numberString;
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
module.exports.returnData = async result => {
  console.log(result);

  const numbers = parseInt(result[0].topics[1], 16);
  const machineID = parseInt(result[0].topics[2], 16);
  const machineIDPadded = padding(machineID, 9);
  const amount = parseInt(result[0].topics[3], 16);

  console.log(
    'wheel numbers: ' + numbers,
    'machine id: ' + machineIDPadded,
    'win amount: ' + amount
  );

  const spinObj = {
    _numbers: numbers,
    _machineID: machineIDPadded,
    _amountWin: amount
  };
  const json = JSON.stringify({ type: 'message', data: spinObj });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // notify each client of new spin result
  wss.clients.forEach(client => {
    client.send(json);
  });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // write event data to mongoDB database
  try {
    // update session DB
    const playData = await dbMongo.findPlayInfo({ machineIDPadded });
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

    // update player DB
    const playerData = await dbMongo.findPlayerInfo({
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

    // update machine Total DB
    const machineTotalData = await dbMongo.findMachineTotalInfo({
      machineIDPadded
    });

    if (machineTotalData) {
      machineTotalData = await dbMongo.updateMachineTotalInfo(
        { machineIDPadded },
        {
          totalAmountWin: Number(machineTotalData.totalAmountWin) + amount
        }
      );
      if (machineTotalData) console.log('machinetotalinfo updating success');
      else console.log('machinetotalinfo updating failed');
    } else {
      console.log(
        "can't find machine total info : machineID = " + machineIDPadded
      );
    }
  } catch (e) {
    console.log(e);
  }
};
