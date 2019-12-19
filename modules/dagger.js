export function setDagger() {
  // connect to Dagger ETH matic network over web socket
  const dagger = new Dagger('wss://matic.dagger2.matic.network');
  // our contract address on matic network
  const address = '0x9d56e8b322d8c75168824cb44183cf3deaff5cd0';

  // new log generated for our contract address
  dagger.on('latest:log/' + address, function(result) {
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
  });
}
