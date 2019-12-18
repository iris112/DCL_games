import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined') {
  if (typeof window.ethereum !== 'undefined') {
    console.log('modern browser and privacy mode enabled');

    web3 = new Web3(window.ethereum);

    try {
      window.ethereum.enable(); // get access to accounts
    } catch (error) {
      console.log('user denied account access: ' + error);
    }
  } else if (typeof window.web3 !== 'undefined') {
    console.log('legacy dapp broswer, using metamask provider');

    web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log('metamask not running, using infura provider');

    const provider = new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/O79Wj1ZCf4chRG0vGAl3'
    );

    // const provider = new Web3.providers.HttpProvider(
    //   'https://mainnet.infura.io/v3/fb96057d2ecf4c4fa7c7ae36bef24924'
    // );

    web3 = new Web3(provider);
  }
} else {
  console.log('we are on the server, using infura provider');

  // const provider = new Web3.providers.HttpProvider(
  //   'https://rinkeby.infura.io/O79Wj1ZCf4chRG0vGAl3'
  // );

  // const provider = new Web3.providers.WebsocketProvider(
  // 'wss://ropsten.infura.io/v3/78b439fd7ce943889dbd895c93b408e4'
  // );

  // const provider = 'wss://rinkeby.infura.io/O79Wj1ZCf4chRG0vGAl3';

  // const provider = new Web3.providers.HttpProvider(
  //   'https://mainnet.infura.io/v3/fb96057d2ecf4c4fa7c7ae36bef24924'
  // );

  // web3 = new Web3(provider);

  const getProvider = () => {
    const provider = new Web3.providers.WebsocketProvider(
      'wss://ropsten.infura.io/ws'
    );
    provider.on('connect', () => console.log('WS Connected'));
    provider.on('error', e => {
      console.error('WS Error', e);
      web3.setProvider(getProvider());
    });
    provider.on('end', e => {
      console.error('WS End', e);
      web3.setProvider(getProvider());
    });

    return provider;
  };
  web3 = new Web3(getProvider());

  // web3 does not handle the disconnect gracefully, so to reconnect call
  // web3.setProvider(new Web3.providers.WebsocketProvider(‘wss://ropsten.infura.io/ws’));

  // also for more robust solutions, use subscriptions rather than the raw event API

  // there also is an alternate wss address that is more stable sometimes:
  // wss://ropsten.infura.io/ws_
}

export default web3;
