"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const dbMongo = __importStar(require("../db/dbMongo"));
var preAction = function (req, res, next) {
    next();
};
const router = express.Router();
router.post('/getMachine', preAction, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var page = req.body.page;
        var limit = req.body.limit;
        var json_data = {
            "status": 'ok',
            "result": null,
        };
        try {
            let indexData;
            let machineInfos;
            if (!page || page == 1) {
                machineInfos = yield dbMongo.findAllMachineInfo({}, { limit });
            }
            else {
                indexData = yield dbMongo.findUserIndexing("admin", page - 1);
                if (indexData)
                    machineInfos = yield dbMongo.findAllMachineInfo({ _id: { $lt: indexData.machineID } }, { limit });
            }
            if (machineInfos && machineInfos.length) {
                indexData = yield dbMongo.findUserIndexing("admin", page);
                if (!indexData)
                    yield dbMongo.insertUserIndexing({ address: "admin", page, machineID: machineInfos[machineInfos.length - 1]._id });
                else
                    yield dbMongo.updateUserIndexing("admin", page, { machineID: machineInfos[machineInfos.length - 1]._id });
                for (let i = 0; i < machineInfos.length; i++) {
                    if (Number(machineInfos[i].totalBetAmount) && Number(machineInfos[i].totalAmountWin))
                        continue;
                    let totalPlayInfos = yield dbMongo.getTotalPlayInfos({
                        gameType: machineInfos[i].gameType,
                        address: machineInfos[i].playerAddresse,
                        machineID: machineInfos[i].machineID,
                        landID: machineInfos[i].landID
                    });
                    if (totalPlayInfos) {
                        yield dbMongo.updateMachineInfo({
                            playerAddresse: machineInfos[i].playerAddresse,
                            machineID: machineInfos[i].machineID,
                            landID: machineInfos[i].landID,
                            gameType: machineInfos[i].gameType
                        }, {
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
        }
        catch (e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
        res.send(json_data);
    });
});
router.get('/getHistory', preAction, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var json_data = {
            "status": 'ok',
            "result": null,
        };
        var limit;
        try {
            var playinfos = yield dbMongo.findAllPlayInfos({}, limit);
            if (!playinfos || playinfos.length == 0)
                json_data['result'] = 'false';
            else
                json_data['result'] = playinfos;
        }
        catch (e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
        res.send(json_data);
    });
});
router.post('/getTotal', preAction, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var period = req.body.period;
        var json_data = {
            "status": 'ok',
            "result": null,
        };
        try {
            var curTime = new Date();
            var slotPlayinfos = yield dbMongo.getTotalPlayInfos({ "createdAt": { "$gte": new Date(curTime.getTime() - Number(period)) }, gameType: 1 });
            var roulettePlayinfos = yield dbMongo.getTotalPlayInfos({ "createdAt": { "$gte": new Date(curTime.getTime() - Number(period)) }, gameType: 2 });
            if (!slotPlayinfos && !roulettePlayinfos)
                json_data['result'] = 'false';
            else
                json_data['result'] = [slotPlayinfos, roulettePlayinfos];
        }
        catch (e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
        res.send(json_data);
    });
});
router.get('/getDeposit', preAction, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var json_data = {
            "status": 'ok',
            "result": null,
        };
        var limit;
        try {
            var txdatas = yield dbMongo.findAllTransaction({}, limit);
            if (txdatas && txdatas.length)
                json_data['result'] = txdatas;
            else
                json_data['result'] = 'false';
        }
        catch (e) {
            console.log(e);
            json_data['status'] = 'fail';
        }
        res.send(json_data);
    });
});
// Error handler
router.use(function (err, req, res, next) {
    if (err) {
        res.status(500).send(err);
    }
});
module.exports = router;
