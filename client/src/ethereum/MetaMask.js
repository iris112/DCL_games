const MetaMask = async () => {
  let message = '';

  await window.web3.eth.getAccounts((err, accounts) => {
    if (err !== null) {
      message = 'An error occurred: ' + err;
    } else if (accounts.length === 0) {
      message = 'User is not logged in to MetaMask';
    } else {
      message = '';
    }
  });

  return message;
};

export default MetaMask;
