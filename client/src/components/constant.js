import RootChain from './ABI/RootChain';
import StandardToken from './ABI/StandardToken';
import DepositManager from './ABI/DepositManager';
import WithdrawManager from './ABI/WithdrawManager';
import ChildERC20Token from './ABI/ChildERC20Token';

const BASE_URL = 'https://decentral.games';
// const BASE_URL = 'https://testdecentralgames.herokuapp.com';
// const BASE_URL = 'http://localhost:5000';
const Buffer = window.ethereumjs.Buffer.Buffer;
const Util = window.ethereumjs.Util;
const RLP = window.ethereumjs.RLP;
const ADMIN_ADDR1 = '0xa7C825BB8c2C4d18288af8efe38c8Bf75A1AAB51'.toLowerCase();
const ADMIN_ADDR2 = '0xDd2d884Cf91ad8b72A78dCD5a25a8a2b29D78f28'.toLowerCase();
const ROPSTEN_TOKEN = '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb';    //Ropsten MANA Token
const MATIC_TOKEN = '0xdd1b834a483fd754c8021ff0938f69c1d10da81f';    // Matic mapped MANA Token

// const SLOTS_CONTRACT_ADDRESS = '0x0F8Dc2c169c52835A87Cfe61B62C1A05193EFB19'.toLowerCase();    // Ropsten address
const SLOTS_CONTRACT_ADDRESS = '0x11f6757ab51a01686b1c54fa0f0c45960b1bd3bc'.toLowerCase();    // Matic address
const TOKEN_DECIMALS = 18;

const ROOTCHAIN_ADDRESS = '0x60e2b19b9a87a3f37827f2c8c8306be718a5f9b4';
const DEPOSITMANAGER_ADDRESS = '0x4072fab2a132bf98207cbfcd2c341adb904a67e9';
const WITHDRAWMANAGER_ADDRESS = '0x4ef2b60cdd4611fa0bc815792acc14de4c158d22'
const SYNCER_URL = 'https://matic-syncer2.api.matic.network/api/v1';
const WATCHER_URL = 'https://ropsten-watcher2.api.matic.network/api/v1';
const MAX_AMOUNT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const GAS_LIMIT = '500000';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

function _apiCall(data = {}) {
  const headers = data.headers || {}

  const queryParams = data.query && Object.keys((data.query || {})).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data.query[k])
  }).join('&')

  const url = `${data.url}?${queryParams || ''}`

  return fetch(url, {
    method: data.method || (data.body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: data.body ? JSON.stringify(data.body) : null,
  }).then(res => {
    if (!res.ok) {
      const err = new Error(res.statusText || 'Unknown error occurred')
      err.response = res
      throw err
    }
    return res.json()
  })
}

async function getTxProof(txId) {
  const { proof: txProof } = await _apiCall({
    url: `${SYNCER_URL}/tx/${txId}/proof`,
  })

  return txProof
}

async function getReceiptProof(txId) {
  const { proof: receiptProof } = await _apiCall({
    url: `${SYNCER_URL}/tx/${txId}/receipt/proof`,
  })

  return receiptProof
}

function getHeaderObject(blockNumber) {
  return _apiCall({
    url: `${WATCHER_URL}/header/included/${blockNumber}`,
  })
}

async function getHeaderProof(blockNumber, header) {
  const { proof: headerProof } = await _apiCall({
    url: `${SYNCER_URL}/block/${blockNumber}/proof`,
    query: {
      start: +header.start,
      end: +header.end,
    },
  })

  return headerProof
}

function balanceOfToken(token, web3 = window.web3) {
  return new Promise(async (resolve, reject) => {
    console.log("getting balance of Token");
    try {
      const TOKEN_CONTRACT = web3.eth.contract(StandardToken.abi).at(token);
      TOKEN_CONTRACT.balanceOf(window.web3.currentProvider.selectedAddress, async function(err, amount) {
        if (err) {
          console.log('getting failed', err);
          reject(false);
        }

        resolve(amount);
      });
    } catch (error) {
        console.log('getting failed', error)
        reject(false);
    }
  });
}

function getAllowedToken(token, contractAddr, user_address) {
 return new Promise(async (resolve, reject) => {
    console.log("get allowed contract");
    try {
      const TOKEN_CONTRACT = window.web3.eth.contract(StandardToken.abi).at(token);
      TOKEN_CONTRACT.allowance(user_address, contractAddr, async function(err, amount) {
        if (err) {
          console.log('get allowed failed', err);
          reject(false);
        }

        resolve(amount);
      });
    } catch (error) {
        console.log('get allowed failed', error)
        reject(false);
    }
  }); 
}

function approveToken(token, amount, contractAddr, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log("Approving contract");
    try {
      const TOKEN_CONTRACT = window.web3.eth.contract(StandardToken.abi).at(token);
      TOKEN_CONTRACT.approve(contractAddr, amount,{
        from: user_address,
        gasLimit: window.web3.toHex(GAS_LIMIT),
        gasPrice: window.web3.toHex('20000000000'),
      }, async function(err, hash) {
        if (err) {
          console.log('Approving failed', err);
          reject(false);
        }

        var ret = await getConfirmedTx(hash);
        if (ret.status == '0x0') {
          console.log('Approving transaction failed');
          reject(false);
        }
        else {
          console.log("Approving done");
          resolve(true);
        }
      });
    } catch (error) {
        console.log('Approving failed', error)
        reject(false);
    }
  });
}

function depositTokenToMatic(token, amount, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log("Deposit start");
    try {
      const ROOTCHAIN_CONTRACT = window.web3.eth.contract(RootChain.abi).at(ROOTCHAIN_ADDRESS);
      ROOTCHAIN_CONTRACT.deposit(token, user_address, amount, {
        from: user_address,
        gasLimit: window.web3.toHex(GAS_LIMIT),
        gasPrice: window.web3.toHex('20000000000'),
      }, async function(err, hash) {
        if (err) {
          console.log('Deposit failed', err);
          reject(false);
        }

        console.log("Deposit done");
        resolve(hash);
      });
    } catch (error) {
        console.log('Deposit failed', error)
        reject(false);
    }
  });
}

function startWithdrawTokenFromMatic(token, amount, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log("Withdraw starting");
    try {
      const TOKEN_CONTRACT = window.web3.eth.contract(ChildERC20Token.abi).at(token);
      TOKEN_CONTRACT.withdraw(amount,{
        from: user_address,
        gasLimit: window.web3.toHex(GAS_LIMIT),
        gasPrice: window.web3.toHex('20000000000'),
      }, async function(err, hash) {
        if (err) {
          console.log('Withdraw starting failed', err);
          reject(false);
        }

        var ret = await getConfirmedTx(hash);
        if (ret.status == '0x0') {
          console.log('Withdraw starting transaction failed');
          resolve(false);
        }
        else {
          console.log("Withdraw starting done");
          resolve(hash);
        }
      });
    } catch (error) {
        console.log('Withdraw starting failed', error)
        reject(false);
    }
  });
}

function withdrawTokenFromMatic(txId, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log("Withdrawing");
    try {
      // fetch trancation & receipt proof
      const [txProof, receiptProof] = await Promise.all([
        getTxProof(txId),
        getReceiptProof(txId),
      ]);

      // fetch header object & header proof
      let header = null
      try {
        header = await getHeaderObject(txProof.blockNumber)
      } catch (e) {
        // ignore error
      }

      // check if header block found
      if (!header) {
        throw new Error(
          `No corresponding checkpoint/header block found for ${txId}.`
        )
      }

      const headerProof = await getHeaderProof(txProof.blockNumber, header);
      const WITHDRAWMANAGER_CONTRACT = window.web3.eth.contract(WithdrawManager.abi).at(WITHDRAWMANAGER_ADDRESS);

      WITHDRAWMANAGER_CONTRACT.withdrawBurntTokens(
        header.number,
        Util.bufferToHex(
          Buffer.concat(headerProof.proof.map(p => Util.toBuffer(p)))
        ), // header proof
        txProof.blockNumber, // block number
        txProof.blockTimestamp, // block timestamp
        txProof.root, // tx root
        receiptProof.root, // receipt root
        Util.bufferToHex(RLP.encode(receiptProof.path)), // key for trie (both tx and receipt)
        txProof.value, // tx bytes
        txProof.parentNodes, // tx proof nodes
        receiptProof.value, // receipt bytes
        receiptProof.parentNodes, { // reciept proof nodes
          from: user_address,
          gasLimit: window.web3.toHex(GAS_LIMIT),
          gasPrice: window.web3.toHex('20000000000'),
        }, async function(err, hash) {
          if (err) {
            console.log('Withdrawing failed', err);
            reject(false);
          }

          var ret = await getConfirmedTx(hash);
          if (ret.status == '0x0') {
            console.log('Withdrawing transaction failed');
            resolve(false);
          }
          else {
            console.log("Withdrawing done");
            resolve(hash);
          }
        });
    } catch (error) {
        console.log('Withdrawing failed', error)
        reject(false);
    }
  });
}

async function processExits(rootTokenAddress, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log("Withdrawing exit");
    try {
      const WITHDRAWMANAGER_CONTRACT = window.web3.eth.contract(WithdrawManager.abi).at(WITHDRAWMANAGER_ADDRESS);
      WITHDRAWMANAGER_CONTRACT.processExits( rootTokenAddress, {
        from: user_address,
        gasLimit: window.web3.toHex(GAS_LIMIT),
        gasPrice: window.web3.toHex('20000000000'),
      }, async function(err, hash) {
        if (err) {
          console.log('Withdraw exit failed', err);
          reject(false);
        }

        var ret = await getConfirmedTx(hash);
        if (ret.status == '0x0') {
          console.log('Withdraw exit transaction failed');
          resolve(false);
        }
        else {
          console.log("Withdraw exit done");
          resolve(hash);
        }
      });
    } catch (error) {
        console.log('Withdrawing exit', error)
        reject(false);
    }
  });
}

function getConfirmedTx(txHash) {
  return new Promise(async (resolve, reject) => {
    var finish = false;
    while (!finish) {
      window.web3.eth.getTransactionReceipt(txHash, (err, res) => {
          if(err){
            finish = true;
            reject(err);
          }
          if (res) {
            finish = true;
            resolve(res);
          }
      });
      await delay(2000);
    }
  });
}

function getMappedToken(token) {
  return new Promise(async (resolve, reject) => {
    console.log("getting Mapped Token");
    try {
      const DEPOSIT_CONTRACT = window.web3.eth.contract(DepositManager.abi).at(DEPOSITMANAGER_ADDRESS);
      DEPOSIT_CONTRACT.tokens(token, async function(err, address) {
        if (err) {
          console.log('getting failed', err);
          reject(false);
        }

        resolve(address);
      });
    } catch (error) {
        console.log('getting failed', error)
        reject(false);
    }
  });
}

export default {
  ADMIN_ADDR1,
  ADMIN_ADDR2,
  BASE_URL,
	ROPSTEN_TOKEN,
	MATIC_TOKEN,
	SLOTS_CONTRACT_ADDRESS,
	TOKEN_DECIMALS,
	ROOTCHAIN_ADDRESS,
	DEPOSITMANAGER_ADDRESS,
	// SLOTS_CONTRACT_ADDRESS,
	SYNCER_URL,
	WATCHER_URL,
	MAX_AMOUNT,
	GAS_LIMIT,

	delay,
  getConfirmedTx,
	balanceOfToken,
	getAllowedToken,
	approveToken,
	depositTokenToMatic,
	getConfirmedTx,
	getMappedToken,
  startWithdrawTokenFromMatic,
  withdrawTokenFromMatic,
  processExits,
}