import * as express from 'express';
import * as fetch from 'node-fetch';
import * as dbMongo from '../db/dbMongo';

var preAction = function(req, res, next) {
    next();
};

const router:express.Router = express.Router();
router.get('/getMachine', preAction, async function (req, res) {
    var json_data = {
        "status": 'ok',
        "result": null,
    };

    try {
        var machineTotalinfos = await dbMongo.findAllMachineTotalInfo({});
        if (!machineTotalinfos || machineTotalinfos.length == 0)
            json_data['result'] = 'false';
        else
            json_data['result'] = machineTotalinfos;

    } catch(e) {
        console.log(e);
        json_data['status'] = 'fail';
    }

    // var machineData = [];
    // try {
    //     var machines = await dbMongo.findAllMachines();
    //     if (!machines || machines.length == 0)
    //         json_data['result'] = 'false';
    //     else {
    //         for (let i = 0; i < machines.length; i++) {
    //             if (machines[i] === '')
    //                 continue;

    //             var players = await dbMongo.findAllMachineInfo({machineID: machines[i]});
    //             var itemData = {
    //                 machineID: machines[i],
    //                 landID: players[0].landID,
    //                 latestSessionDate: '',
    //                 totalBetAmount: 0,
    //                 totalAmountWin: 0
    //             };
    //             for (let m = 0; m < players.length; m++) {
    //                 // bets and payouts
    //                 var playerData = await dbMongo.findPlayerInfo({address: players[m].playerAddresse});
    //                 if (!playerData) {
    //                     console.log("player info " + players[m].playerAddresse + " not exist");
    //                     return;
    //                 }

    //                 if (playerData.totalBetAmount == 0 || String(playerData.totalBetAmount) == 'NaN') {
    //                     var playsData = await dbMongo.findAllPlayInfos({address: players[m].playerAddresse}, 200);
    //                     var totalAmount = 0;
    //                     for (let j = 0; j < playsData.length; j++) 
    //                         totalAmount += Number(playsData[j].betAmount);

    //                     if (totalAmount != 0) {
    //                         await dbMongo.updatePlayerInfo({address: players[m].playerAddresse}, {totalBetAmount: totalAmount});
    //                         itemData.totalBetAmount += totalAmount;
    //                     }
    //                 } else {
    //                     itemData.totalBetAmount += playerData.totalBetAmount;
    //                 }
    //                 itemData.totalAmountWin += playerData.totalAmountWin;
                    
    //                 if (itemData.latestSessionDate === '') {
    //                     itemData.latestSessionDate = playerData.latestSessionDate;
    //                 } else {
    //                     var playerDate = new Date(playerData.latestSessionDate);
    //                     var latestDate = new Date(itemData.latestSessionDate);
    //                     if (playerDate > latestDate)
    //                         itemData.latestSessionDate = playerData.latestSessionDate;
    //                 }
    //             }

    //             var tempData = await dbMongo.findMachineTotalInfo({
    //               machineID: itemData.machineID
    //             });
    //             console.log(tempData);
    //             if (!tempData) {
    //                 await dbMongo.insertMachineTotalInfo({
    //                     machineID: itemData.machineID,
    //                     landID: itemData.landID,
    //                     totalBetAmount: itemData.totalBetAmount,
    //                     totalAmountWin: itemData.totalAmountWin,
    //                     latestSessionDate: itemData.latestSessionDate
    //                 });
    //             } else {
    //                 await dbMongo.updateMachineTotalInfo({machineID: itemData.machineID}, {
    //                     totalBetAmount: itemData.totalBetAmount,
    //                     totalAmountWin: itemData.totalAmountWin,
    //                     latestSessionDate: itemData.latestSessionDate
    //                 });
    //             }
    //             machineData.push(itemData);
    //         }
    //         json_data['result'] = machineData;
    //     }
    // } catch(e) {
    //     console.log(e);
    //     json_data['status'] = 'fail';
    // }

    res.send(json_data);
});

router.get('/getHistory', preAction, async function (req, res) {
    var json_data = {
        "status": 'ok',
        "result": null,
    };
    var limit;

    try {
        var playinfos = await dbMongo.findAllPlayInfos({}, limit);
        if (!playinfos || playinfos.length == 0)
            json_data['result'] = 'false';
        else
            json_data['result'] = playinfos;

    } catch(e) {
        console.log(e);
        json_data['status'] = 'fail';
    }

    res.send(json_data);
});

router.post('/getTotal', preAction, async function (req, res) {
    var page = req.body.page;
    var period = req.body.period;
    var limit = req.body.limit || 100;
    var json_data = {
        "status": 'ok',
        "result": null,
    };

    try {
        var curTime = new Date();
        var playinfos = await dbMongo.findAllPlayInfos({"createdAt" : {"$gte" : new Date(curTime.getTime() - Number(period))}}, {limit, page});
        if (!playinfos || playinfos.length == 0)
            json_data['result'] = 'false';
        else
            json_data['result'] = playinfos;

    } catch(e) {
        console.log(e);
        json_data['status'] = 'fail';
    }

    res.send(json_data);
});

router.get('/getDeposit', preAction, async function (req, res) {
    var json_data = {
        "status": 'ok',
        "result": null,
    };
    var limit;

    try {
        var txdatas = await dbMongo.findAllTransaction({}, limit);
        if (txdatas && txdatas.length)
            json_data['result'] = txdatas;
        else
            json_data['result'] = 'false';
    } catch(e) {
        console.log(e);
        json_data['status'] = 'fail';
    }

    res.send(json_data);
});

// Error handler
router.use(function(err, req, res, next) {
    if (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
