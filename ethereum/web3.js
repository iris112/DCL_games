import Web3 from 'web3';

let web3;
let message;

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

  // const provider = new Web3.providers.HttpProvider(
  // 'https://rinkeby.infura.io/O79Wj1ZCf4chRG0vGAl3'
  // );

  const provider = new Web3.providers.HttpProvider(
    'https://mainnet.infura.io/v3/fb96057d2ecf4c4fa7c7ae36bef24924'
  );

  web3 = new Web3(provider);
}

if (typeof window.ethereum !== 'undefined') {
  window.web3.version.getNetwork((err, netId) => {
    switch (netId) {
      case '1':
        message = ''; // main network

        break;
      case '2':
        message = 'Please change MetaMask to Main Ethereum Network to continue'; // morden

        break;
      case '3':
        message = 'Please change MetaMask to Main Ethereum Network to continue'; // ropsten

        break;
      case '4':
        message = 'Please change MetaMask to Main Ethereum Network to continue'; // rinkeby

        break;
      case '42':
        message = 'Please change MetaMask to Main Ethereum Network to continue'; // kovan

        break;
      default:
        message = 'Please change MetaMask to Main Ethereum Network to continue'; // unknown
    }
  });
}

export { web3, message };
