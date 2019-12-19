const ABIDecentralotto = require('../contracts/decentralotto/ABIDecentralotto.json');

export function setInfura() {
  // refreshes provider instance and attaches event handlers to it
  function refreshProvider(web3Obj, providerUrl) {
    let retries = 0;

    function retry(event) {
      if (event) {
        console.log('Web3 provider disconnect or error');

        retries += 1;

        if (retries > 5) {
          console.log(`Max retries of 5 exceeded: ${retries} times tried`);

          return setTimeout(refreshProvider, 5000);
        }
      } else {
        console.log(`Reconnecting web3 provider ${providerUrl}`);

        refreshProvider(web3Obj, providerUrl);
      }

      return null;
    }

    const provider = new Web3.providers.WebsocketProvider(providerUrl);

    provider.on('end', () => retry());
    provider.on('error', () => retry());

    web3Obj.setProvider(provider);

    console.log('Infura Web3 provider initiated');

    return provider;
  }

  refreshProvider(
    web3,
    'wss://ropsten.infura.io/ws/v3/50974616163d4abea65ffa070e26da30'
  );

  const instance = new web3.eth.Contract(
    ABIDecentralotto,
    '0xCC29687Db88058D6313aD5D16a1b0D1383418375'
  );

  // listen and handle smart contract events
  instance.events.PlayerAdded((err, res) => {
    if (err) {
      console.log('Error in listening to PlayerAdded event ', err);
    }

    const event = {
      eventName: 'PlayerAdded',
      data: res
    };

    wss.clients.forEach(client => {
      client.send(JSON.stringify(event));
    });
  });
}
