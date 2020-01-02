import * as express from 'express';
import * as fetch from 'node-fetch';
import * as dbMongo from '../db/dbMongo';
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const keys = require('../config/keys');

var preAction = function(req, res, next) {
    next();
};
const testnet = 'https://testnet2.matic.network';
// const testnet = 'https://beta.matic.network';
const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
const privateKey = Buffer.from(keys.RELAYER_PRIVATE_KEY, 'hex');
const customCommon = Common.forCustomChain(
  'mainnet',
  {
    name: 'matic-testnet2',
    networkId: 8995,
    chainId: 8995
  },
  // {
  //   name: 'beta',
  //   networkId: 15001,
  //   chainId: 15001
  // },
  'petersburg'
);

function sendEthTransaction(toAddress) {
	web3.eth.getTransactionCount(keys.RELAYER_ADDRESS, "pending").then(function(lastCountOfTransaction){     
		console.log('lastCountOfTransaction = ' + lastCountOfTransaction);
		var rawTx = {
			nonce: lastCountOfTransaction,
			gasPrice: web3.utils.toHex(keys.GAS_PRICE), 
			gasLimit: web3.utils.toHex(keys.GAS_LIMIT),
			value: web3.utils.toHex(web3.utils.toWei(keys.GAS_FEE_AMOUNT)), 
			to: toAddress,
			data: ''
		};
		var tx = new Tx(rawTx, { common: customCommon });
		tx.sign(privateKey);
		var serializedTx = tx.serialize();

		web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
			if (!err)
				console.log('Tx hash = ' + hash);
			else
				console.log(err);
		});
	});
}

const router:express.Router = express.Router();
router.post('/verifyAddress', preAction, async function(req, res) {
    var address = req.body.address;
    var json_data = {
        "status": 'ok',
        "result": '',
    };

    if (address === '')
        json_data['result'] = 'false';
        else {
        try {
            var userdata = await dbMongo.findUser(address);
            if (userdata)
                json_data['result'] = userdata.verifyStep;
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/getUser', preAction, async function(req, res) {
    var address = req.body.address;
    var json_data = {
        "status": 'ok',
        "result": '',
    };

    if (address === '')
        json_data['result'] = 'false';
        else {
        try {
            var userdata = await dbMongo.findUser(address);
            if (userdata)
                json_data['result'] = userdata;
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/authState', preAction, async function(req, res) {
    var address = req.body.address;
    var json_data = {
        "status": 'ok',
        "result": '',
    };

    if (address === '')
        json_data['result'] = 'false';
        else {
        try {
            var userdata = await dbMongo.findUser(address);
            if (userdata)
                json_data['result'] = userdata.authorized;
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/addAddress', preAction, async function(req, res) {
    var address = req.body.address;
    var manaLock = req.body.manaLock;
    var ethLock = req.body.ethLock;
    var json_data = {
        "status":'ok',
        "result":'',
    };

    if (address === '')
        json_data['result'] = 'false';
    else {
        try {
            var userdata = await dbMongo.findUser(address);
            if (userdata)
                json_data['result'] = 'true';
            else {
                userdata = await dbMongo.insertUser({address, MANALocked:manaLock, ETHLocked:ethLock});
                if (userdata) {
                    json_data['result'] = 'true';
                }
                else
                    json_data['result'] = 'false';
            }
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/updateHistory', preAction, async function(req, res) {
    var address = req.body.address;
    var txid = req.body.txHash;
    var amount = req.body.amount;
    var type = req.body.type;
    var status = req.body.state;
    var step = req.body.step || 0;
    step = parseInt(step);
    
    var json_data = {
        "status":'ok',
        "result":'',
    };

    if (address === '')
        json_data['result'] = 'false';
    else {
        try {
            var txdata = await dbMongo.findTransaction(txid);
            if (txdata) {
                await dbMongo.updateTransaction(txid, {address, txid, amount, type, status, step});
                json_data['result'] = 'true';
            }
            else {
                txdata = await dbMongo.insertTransaction({address, txid, amount, type, status, step});
                if (txdata)
                    json_data['result'] = 'true';
                else
                    json_data['result'] = 'false';
            }
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/checkHistory', preAction, async function(req, res) {
    var txid = req.body.txHash;
    var json_data = {
        "status":'ok',
        "result":'',
    };

    if (txid === '')
        json_data['result'] = 'false';
    else {
        try {
            var txdata = await dbMongo.findTransaction(txid);
            if (txdata)
                json_data['result'] = txdata;
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/confirmHistory', preAction, async function(req, res) {
    var txid = req.body.txHash;
    var step = parseInt(req.body.step);
    var json_data = {
        "status":'ok',
        "result":'',
    };

    if (txid === '')
        json_data['result'] = 'false';
    else {
        try {
            var txdata = await dbMongo.findTransaction(txid);
            if (txdata) {
                let date = new Date(txdata.updatedAt);
                let currentDate = new Date();
                if (step == 1) {
                    if (currentDate.getTime() - date.getTime() < 2 * 24 * 60 * 60 * 1000)
                        json_data['result'] = 'false';
                    else
                        json_data['result'] = 'true';
                } else if (step == 2) {
                    if (currentDate.getTime() - date.getTime() < 15 * 60 * 1000)
                        json_data['result'] = 'false';
                    else
                        json_data['result'] = 'true';
                }
            }
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/getHistory', preAction, async function(req, res) {
    var address = req.body.address;
    var limit = req.body.limit;
    var json_data = {
        "status": 'ok',
        "result": '',
    };

    if (address === '')
        json_data['result'] = 'false';
    else {
        try {
            let currentDate = new Date();
            var txdatas = await dbMongo.findAllTransaction({address}, limit);
            if (txdatas && txdatas.length) {
                for (let i = 0; i < txdatas.length; i++) {
                    if (txdatas[i].type != 'Withdraw')
                        continue;

                    if (parseInt(txdatas[i].step) == 1 && txdatas[i].status == 'In Progress') {
                        let date = new Date(txdatas[i].updatedAt);
                        if (currentDate.getTime() - date.getTime() > 2 * 24 * 60 * 60 * 1000) {
                            txdatas[i].status = 'Ready';
                            await dbMongo.updateTransaction(txdatas[i].txid, txdatas[i]);
                        }
                    } else if (parseInt(txdatas[i].step) == 3 && txdatas[i].status == 'In Progress') {
                        let date = new Date(txdatas[i].updatedAt);
                        if (currentDate.getTime() - date.getTime() > 15 * 60 * 1000) {
                            txdatas[i].status = 'Ready';
                            await dbMongo.updateTransaction(txdatas[i].txid, txdatas[i]);
                        }
                    }
                }
                json_data['result'] = txdatas;
            }
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/existWithdraw', preAction, async function(req, res) {
    var address = req.body.address;
    var limit;
    var json_data = {
        "status": 'ok',
        "result": '',
    };

    if (address === '')
        json_data['result'] = 'false';
    else {
        try {
            var txdatas = await dbMongo.findAllTransaction({address, type: 'Withdraw', status: {$ne: 'Confirmed'}}, limit);
            if (txdatas && txdatas.length)
                json_data['result'] = 'true';
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/getPlayInfo', preAction, async function(req, res) {
    var address = req.body.address;
    var limit = req.body.limit;
    var json_data = {
        "status": 'ok',
        "result": '',
    };

    if (address === '')
        json_data['result'] = 'false';
    else {
        try {
            var playinfodatas = await dbMongo.findAllPlayInfos({address}, limit);
            if (playinfodatas && playinfodatas.length)
                json_data['result'] = playinfodatas;
            else
                json_data['result'] = 'false';
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/updateUserVerify', preAction, async function(req, res) {
    var address = req.body.address;
    var verifyStep = req.body.verifyStep;
    var json_data = {
        "status":'ok',
        "result":'',
    };

    if (address === '')
        json_data['result'] = 'false';
    else {
        try {
            var userdata = await dbMongo.findUser(address);
            if (userdata) {
                userdata.verifyStep = verifyStep;
                if (parseInt(verifyStep) == 5 && parseInt(userdata.gasFill || 0) == 0) {
                    userdata.gasFill = 1;
                    sendEthTransaction(address);
                }
                await dbMongo.updateUser(address, userdata);
                json_data['result'] = 'true';
            }
            else {
                sendEthTransaction(address);
                userdata = await dbMongo.insertUser({address, verifyStep, gasFill: 1});
                if (userdata) {
                    json_data['result'] = 'true';
                }
                else
                    json_data['result'] = 'false';
            }
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/updateUserAuthState', preAction, async function(req, res) {
    var address = req.body.address;
    var authorized = req.body.authorized;
    var json_data = {
        "status":'ok',
        "result":'',
    };

    if (address === '')
        json_data['result'] = 'false';
    else {
        try {
            var userdata = await dbMongo.findUser(address);
            if (userdata) {
                userdata.authorized = userdata.authorized | authorized;
                await dbMongo.updateUser(address, userdata);
                json_data['result'] = 'true';
            }
            else {
                userdata = await dbMongo.insertUser({address, authorized});
                if (userdata) {
                    json_data['result'] = 'true';
                }
                else
                    json_data['result'] = 'false';
            }
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/addEmailName', preAction, async function(req, res) {
    var address = req.body.address;
    var email = req.body.email;
    var name = req.body.name;
    var json_data = {
        "status":'ok',
        "result":'',
    };

    if (address === '')
        json_data['result'] = 'false';
    else if (email === '' || name === '')
        json_data['result'] = 'Email or Name must has value';
    else {
        try {
            var userdata = await dbMongo.findUser(address);
            if (userdata) {
                userdata.email = email;
                userdata.name = name;
                await dbMongo.updateUser(address, userdata);
                json_data['result'] = 'true';
            }
            else {
                userdata = await dbMongo.insertUser({address, email, name});
                if (userdata) {
                    json_data['result'] = 'true';
                }
                else
                    json_data['result'] = 'false';
            }
        } catch(e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
    }

    res.send(json_data);
});

router.post('/addTrade', preAction, async function(req, res) {
    var data = {
        address: req.body.address,
        MANAamount: req.body.MANAamount,
        ETHamount: req.body.ETHamount,
        paymentType: req.body.paymentType,
        txHash: req.body.txHash
    };

    var json_data = {
        "status":'ok',
        "result":'',
    };

    try {
        var tradingdata = await dbMongo.insertUserTrading(data);
        if (tradingdata)
            json_data['result'] = 'true';
        else
            json_data['result'] = 'false';
        
    } catch(e) {
        console.log(e);
        json_data['status'] = 'fail';
    }

    res.send(json_data);
});

// router.get('/get_temp', preAction, async function (req, res) {
//     var json_data = {
//         "status": 'success',
//     };

//     try {
//         if (result === 'fail')
//             json_data['status'] = 'fail';
//         else
//             json_data['result'] = result;
//     } catch(e) {
//         console.log(e);
//         json_data['status'] = 'fail';
//     }

//     res.send(json_data);
// });

// Error handler
router.use(function(err, req, res, next) {
    if (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
