import * as express from 'express';
import * as fetch from 'node-fetch';
import * as dbMongo from '../db/dbMongo';

var preAction = function(req, res, next) {
    next();
};

const router:express.Router = express.Router();
router.post('/getMachine', preAction, async function (req, res) {
    var page = req.body.page;
    var limit = req.body.limit;
    var json_data = {
        "status": 'ok',
        "result": null,
    };

    try {
        let indexData;
        let machineInfos
        if (!page || page == 1) {
            machineInfos = await dbMongo.findAllMachineInfo({}, {limit});
        } else {
            indexData = await dbMongo.findUserIndexing("admin", page - 1);
            if (indexData)
                machineInfos = await dbMongo.findAllMachineInfo({_id: {$lt: indexData.machineID}}, {limit});
        }
        
        if (machineInfos && machineInfos.length) {
            indexData = await dbMongo.findUserIndexing("admin", page);
            if (!indexData)
                await dbMongo.insertUserIndexing({address: "admin", page, machineID: machineInfos[machineInfos.length - 1]._id});
            else
                await dbMongo.updateUserIndexing("admin", page, {machineID: machineInfos[machineInfos.length - 1]._id});

            for (let i = 0; i < machineInfos.length; i++) {
                if (Number(machineInfos[i].totalBetAmount) && Number(machineInfos[i].totalAmountWin))
                    continue;

                let totalPlayInfos = await dbMongo.getTotalPlayInfos({
                    gameType: machineInfos[i].gameType, 
                    address: machineInfos[i].playerAddresse, 
                    machineID: machineInfos[i].machineID, 
                    landID: machineInfos[i].landID});
                if (totalPlayInfos) {
                    await dbMongo.updateMachineInfo(
                        {
                            playerAddresse: machineInfos[i].playerAddresse, 
                            machineID: machineInfos[i].machineID,
                            landID: machineInfos[i].landID,
                            gameType: machineInfos[i].gameType
                        },
                        {
                            totalBetAmount: totalPlayInfos.totalBetAmount,
                            totalAmountWin: totalPlayInfos.totalAmountWin
                        });
                    machineInfos[i].totalBetAmount = totalPlayInfos.totalBetAmount;
                    machineInfos[i].totalAmountWin = totalPlayInfos.totalAmountWin;
                }
            }
            json_data['result'] = machineInfos;
        }
        else
            json_data['result'] = 'false';
    } catch(e) {
        console.log(e);
        json_data['status'] = 'fail';
    }

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
    var period = req.body.period;   
    var json_data = {
        "status": 'ok',
        "result": null,
    };

    try {
        var curTime = new Date();
        var slotPlayinfos = await dbMongo.getTotalPlayInfos({"createdAt" : {"$gte" : new Date(curTime.getTime() - Number(period))}, gameType: 1});
        var roulettePlayinfos = await dbMongo.getTotalPlayInfos({"createdAt" : {"$gte" : new Date(curTime.getTime() - Number(period))}, gameType: 2});
        if (!slotPlayinfos && !roulettePlayinfos)
            json_data['result'] = 'false';
        else
            json_data['result'] = [slotPlayinfos, roulettePlayinfos];

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
