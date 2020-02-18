import RootChain from './ABI/RootChain';
import MANASlots from './ABI/ABISlotsMANA';
import StandardToken from './ABI/StandardToken';
import DepositManager from './ABI/DepositManager';
import WithdrawManager from './ABI/WithdrawManager';
import ChildERC20Token from './ABI/ChildERC20Token';
import { Transaction } from 'ethereumjs-tx';
import EthJS from 'ethjs';
import CommonDefault from 'ethereumjs-common';
// import MyWeb3 from 'web3';


const BASE_URL = "https://decentral.games";
// const BASE_URL = "https://testdecentralgames.herokuapp.com";
// const BASE_URL = "http://localhost:5000";
const Buffer = window.ethereumjs.Buffer.Buffer;
const Util = window.ethereumjs.Util;
const RLP = window.ethereumjs.RLP;
const ADMIN_ADDR = [
  '0xa7C825BB8c2C4d18288af8efe38c8Bf75A1AAB51'.toLowerCase(),
  '0xDd2d884Cf91ad8b72A78dCD5a25a8a2b29D78f28'.toLowerCase(),
  '0xDf4eC4dAdCCAbBE4bC44C5D3597abBA54B18Df45'.toLowerCase(),
  '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A'.toLowerCase()
];
const RELAY_ADDR = '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A'.toLowerCase();
const ROPSTEN_TOKEN = '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb';    //Ropsten MANA Token
const MATIC_TOKEN = '0xdd1b834a483fd754c8021ff0938f69c1d10da81f';    // Matic mapped MANA Token

// const SLOTS_CONTRACT_ADDRESS = '0x0F8Dc2c169c52835A87Cfe61B62C1A05193EFB19'.toLowerCase();    // Ropsten address
const SLOTS_CONTRACT_ADDRESS = '0x2Ec2ef21a0968C054490CF0cfBaadBD892d1c094'.toLowerCase();    // Matic address
const ROULETTE_CONTRACT_ADDRESS = '0x04056a039a10854447c298311abf1fd21cc90e3e'.toLowerCase();    // Matic address
const PARENT_CONTRACT_ADDRESS = '0xd5d543db6aaf6442d9dd14b9539285fc4470c773'.toLowerCase();
const MASTER_CONTRACT_ADDRESS = '0x2Ec2ef21a0968C054490CF0cfBaadBD892d1c094'.toLowerCase(); // Parent contract address
const TOKEN_DECIMALS = 18;

const ROOTCHAIN_ADDRESS = '0x60e2b19b9a87a3f37827f2c8c8306be718a5f9b4';    //test
// const ROOTCHAIN_ADDRESS = '0xA4edab1eF6358c40D487a9D466D977e98F7AC218'.toLowerCase();  //main
const DEPOSITMANAGER_ADDRESS = '0x4072fab2a132bf98207cbfcd2c341adb904a67e9';  //test
// const DEPOSITMANAGER_ADDRESS = '0xe60eb6A559eec79f65f2207366D32A68fD171944'.toLowerCase();  //main
const WITHDRAWMANAGER_ADDRESS = '0x4ef2b60cdd4611fa0bc815792acc14de4c158d22'  //test
// const WITHDRAWMANAGER_ADDRESS = '0x4D67F2e7Be1807D76D5E55e21Af6300ad35c19e9'.toLowerCase();  //main
const SYNCER_URL = 'https://matic-syncer2.api.matic.network/api/v1';
const WATCHER_URL = 'https://ropsten-watcher2.api.matic.network/api/v1';
const MAX_AMOUNT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const GAS_LIMIT = '500000';
const MATIC_NETWORK_ID = '8995'  //test
// const MATIC_NETWORK_ID = '15001'  //main


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

function balanceOfToken(token, web3 = window.web3, address = window.web3.currentProvider.selectedAddress) {
  return new Promise(async (resolve, reject) => {
    console.log("getting balance of Token");
    try {
      const TOKEN_CONTRACT = web3.eth.contract(StandardToken.abi).at(token);
      TOKEN_CONTRACT.balanceOf(address, async function(err, amount) {
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

async function approveToken(token, amount, contractAddr, user_address, relay = 1) {
  if (relay == 1)
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

  // return new Promise(async (resolve, reject) => {
  //     console.log("Approving contract");
  //     try {
  //       const TOKEN_CONTRACT = window.web3.eth.contract(StandardToken.abi).at(token);
  //       const functionABI = TOKEN_CONTRACT.approve.getData(contractAddr, amount);
  //       const customCommon = CommonDefault.forCustomChain(
  //         'mainnet',
  //         {
  //           name: 'ropsten',
  //           networkId: 3,
  //           chainId: 3
  //         },
  //         'petersburg'
  //       );
  //       window.web3.eth.getTransactionCount(user_address, async function(err, nonce) {
  //         if (err) {
  //           console.log('Approving failed', err);
  //           reject(false);
  //         }

  //         console.log('nonce', nonce);
  //         window.web3_1 = new MyWeb3(window.web3.currentProvider);
  //         window.web3_1.eth.signTransaction({
  //             from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0",
  //             gasPrice: "20000000000",
  //             gas: "21000",
  //             to: '0x3535353535353535353535353535353535353535',
  //             value: "1000000000000000000",
  //             data: ""
  //         }, async function (err, res) {
  //           console.log('error', err);
  //           console.log('res', res);
  //         });
  //         resolve(true);
  //       });
  //     } catch (error) {
  //         console.log('Approving failed', error)
  //         reject(false);
  //     }
  //   });
}
// approveToken(ROPSTEN_TOKEN, MAX_AMOUNT, ROOTCHAIN_ADDRESS, window.web3.currentProvider.selectedAddress, 0);

async function depositTokenToMatic(token, amount, user_address, relay = 1) {
  if (relay == 1)
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

function depositTokenToMANASlots(amount, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log("Deposit start");
    try {
      const MANASLOTS_CONTRACT = window.web3.eth.contract(MANASlots.abi).at(SLOTS_CONTRACT_ADDRESS);
      MANASLOTS_CONTRACT.addFunds(amount, {
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

function withdrawTokenFromMANASlots(amount, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log("Withdraw start");
    try {
      const MANASLOTS_CONTRACT = window.web3.eth.contract(MANASlots.abi).at(SLOTS_CONTRACT_ADDRESS);
      MANASLOTS_CONTRACT.withdrawFunds(amount, {
        from: user_address,
        gasLimit: window.web3.toHex(GAS_LIMIT),
        gasPrice: window.web3.toHex('20000000000'),
      }, async function(err, hash) {
        if (err) {
          console.log('Withdraw failed', err);
          reject(false);
        }

        console.log("Withdraw done");
        resolve(hash);
      });
    } catch (error) {
        console.log('Withdraw failed', error)
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
      console.log(headerProof);
      console.log(txProof);
      console.log(receiptProof)
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
  ADMIN_ADDR,
  RELAY_ADDR,
  BASE_URL,
	ROPSTEN_TOKEN,
	MATIC_TOKEN,
	SLOTS_CONTRACT_ADDRESS,
  ROULETTE_CONTRACT_ADDRESS,
	TOKEN_DECIMALS,
	ROOTCHAIN_ADDRESS,
	DEPOSITMANAGER_ADDRESS,
  MATIC_NETWORK_ID,
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
  depositTokenToMANASlots,
  withdrawTokenFromMANASlots,
	getConfirmedTx,
	getMappedToken,
  startWithdrawTokenFromMatic,
  withdrawTokenFromMatic,
  processExits,
}
