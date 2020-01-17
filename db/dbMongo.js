"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Int32 = require('mongoose-int32');
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.set('debug', true);
if (process.env.NODE_ENV === 'production') {
    mongoose_1.default.connect('mongodb+srv://stepan:2I5KCpA55fkTOq7x@decentralgames-w8m2c.mongodb.net/DCL_Production?retryWrites=true&w=majority', { useNewUrlParser: true }, function (err) {
        // if we failed to connect, abort
        if (err)
            console.log(err);
        else
            console.log('mongoDB Connected');
    });
}
else {
    mongoose_1.default.connect('mongodb+srv://stepan:2I5KCpA55fkTOq7x@decentralgames-w8m2c.mongodb.net/DCL_Dev?retryWrites=true&w=majority', { useNewUrlParser: true }, function (err) {
        // if we failed to connect, abort
        if (err)
            console.log(err);
        else
            console.log('mongoDB Connected');
    });
}
const connection = mongoose_1.default.connection;
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(connection);
const Schema = mongoose_1.default.Schema;
const userAddresses = new Schema({
    address: { type: String, default: '', unique: true, index: true },
    MANALocked: { type: Schema.Types.Decimal128, default: 0 },
    ETHLocked: { type: Schema.Types.Decimal128, default: 0 },
    verifyStep: { type: Int32, default: 1 },
    authorized: { type: Int32, default: 0 },
    email: { type: String, default: '' },
    name: { type: String, default: '' },
    gasFill: { type: Int32, default: 0 },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    collection: 'userAddresses'
});
userAddresses.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.MANALocked)
            ret.MANALocked = Number(ret.MANALocked.toString());
        if (ret.ETHLocked)
            ret.ETHLocked = Number(ret.ETHLocked.toString());
        return ret;
    },
});
const userTransactions = new Schema({
    address: { type: String, default: '' },
    txid: { type: String, default: '', unique: true, index: true },
    amount: { type: Schema.Types.Decimal128, default: 0 },
    type: { type: String, default: '' },
    status: { type: String, default: '' },
    step: { type: Int32, default: 0 },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    collection: 'userTransactions'
});
userTransactions.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.amount)
            ret.amount = Number(ret.amount.toString());
        return ret;
    },
});
const userTradings = new Schema({
    address: { type: String, default: '' },
    MANAamount: { type: Schema.Types.Decimal128, default: 0 },
    ETHamount: { type: Schema.Types.Decimal128, default: 0 },
    paymentType: { type: String, default: '' },
    txHash: { type: String, default: '', unique: true, index: true },
    confirmed: { type: Int32, default: 0 },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    collection: 'userTradings'
});
userTradings.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.MANAamount)
            ret.MANAamount = Number(ret.MANAamount.toString());
        if (ret.ETHamount)
            ret.ETHamount = Number(ret.ETHamount.toString());
        return ret;
    },
});
const userPlayInfos = new Schema({
    address: { type: String, default: '' },
    coinName: { type: String, default: '' },
    betAmount: { type: Schema.Types.Decimal128, default: 0 },
    machineID: { type: String, default: '' },
    landID: { type: String, default: '' },
    number: { type: Int32, default: 0 },
    amountWin: { type: Schema.Types.Decimal128, default: 0 },
    txid: { type: String, default: '' },
    type: { type: String, default: '' },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    collection: 'userPlayInfos'
});
userPlayInfos.set('toJSON', {
    transform: (doc, ret) => {
        // if (ret.betAmount) {
        //   let betAmount = ret.betAmount.map(function(item) { return Number(item); });
        //   ret.betAmount = betAmount;
        // }
        // if (ret.amountWin) {
        //   let amountWin = ret.amountWin.map(function(item) { return Number(item); });
        //   ret.amountWin = amountWin;
        // }
        if (ret.betAmount)
            ret.betAmount = Number(ret.betAmount.toString());
        if (ret.amountWin)
            ret.amountWin = Number(ret.amountWin.toString());
        return ret;
    },
});
const userPlayerInfos = new Schema({
    address: { type: String, default: '', unique: true, index: true },
    type: { type: String, default: '' },
    totalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    totalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    latestSessionDate: { type: Date, default: null },
    numberOfFreePlays: { type: Int32, default: 0 },
    numberOfPayoutPlays: { type: Int32, default: 0 }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    collection: 'userPlayerInfos'
});
userPlayerInfos.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.totalBetAmount)
            ret.totalBetAmount = Number(ret.totalBetAmount.toString());
        if (ret.totalAmountWin)
            ret.totalAmountWin = Number(ret.totalAmountWin.toString());
        return ret;
    },
});
const machineInfos = new Schema({
    playerAddresse: { type: String, default: '' },
    machineID: { type: String, default: '' },
    landID: { type: String, default: '' },
    type: { type: String, default: '' },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    collection: 'machineInfos'
});
const machineTotalInfos = new Schema({
    machineID: { type: String, default: '' },
    landID: { type: String, default: '' },
    type: { type: String, default: '' },
    totalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    totalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    latestSessionDate: { type: Date, default: null }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    collection: 'machineTotalInfos'
});
machineTotalInfos.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.totalBetAmount)
            ret.totalBetAmount = Number(ret.totalBetAmount.toString());
        if (ret.totalAmountWin)
            ret.totalAmountWin = Number(ret.totalAmountWin.toString());
        return ret;
    },
});
const userAddressesModel = connection.model('userAddresses', userAddresses);
const userTransactionsModel = connection.model('userTransactions', userTransactions);
const userTradingsModel = connection.model('userTradings', userTradings);
const userPlayInfosModel = connection.model('userPlayInfos', userPlayInfos);
const userPlayerInfosModel = connection.model('userPlayerInfos', userPlayerInfos);
const machineInfosModel = connection.model('machineInfos', machineInfos);
const machineTotalInfosModel = connection.model('machineTotalInfos', machineTotalInfos);
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        // This produce empty db item. so disable temporarily.
        // await new userAddressesModel().save()
        // await new userTransactionsModel().save()
        // await new userTradingsModel().save()
        // await new userEmailsModel().save()
    });
}
exports.initDb = initDb;
// ------------- userAddresses -------------------
function insertUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let UserAddressesModel = new userAddressesModel();
        UserAddressesModel.address = data.address || '';
        UserAddressesModel.MANALocked = data.MANALocked || 0;
        UserAddressesModel.ETHLocked = data.ETHLocked || 0;
        UserAddressesModel.email = data.email || '';
        UserAddressesModel.name = data.name || '';
        UserAddressesModel.verifyStep = data.verifyStep || 1;
        UserAddressesModel.authorized = data.authorized || 0;
        UserAddressesModel.gasFill = data.gasFill || 0;
        UserAddressesModel = yield UserAddressesModel.save();
        return UserAddressesModel.toJSON();
    });
}
exports.insertUser = insertUser;
function findUser(address) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield userAddressesModel.findOne({ address }).exec();
        if (user)
            return user.toJSON();
        return user;
    });
}
exports.findUser = findUser;
function updateUser(address, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield userAddressesModel.findOneAndUpdate({ address }, data, { new: true }).exec();
        if (ret)
            return ret.toJSON();
        return ret;
    });
}
exports.updateUser = updateUser;
// -------- userTransactions --------
function insertTransaction(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let TransactionModel = new userTransactionsModel();
        TransactionModel.address = data.address || '';
        TransactionModel.amount = data.amount || 0;
        TransactionModel.type = data.type || '';
        TransactionModel.status = data.status || '';
        TransactionModel.step = data.step || 0;
        TransactionModel.txid = data.txid || '';
        TransactionModel = yield TransactionModel.save();
        return TransactionModel.toJSON();
    });
}
exports.insertTransaction = insertTransaction;
function findTransaction(txid) {
    return __awaiter(this, void 0, void 0, function* () {
        var tx = yield userTransactionsModel.findOne({ txid }).exec();
        if (tx)
            return tx.toJSON();
        return tx;
    });
}
exports.findTransaction = findTransaction;
function findAllTransaction(data, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        var opts = {};
        opts['limit'] = limit || 20;
        opts['page'] = 1;
        const offset = (opts['page'] - 1) * opts['limit'];
        let ret = yield userTransactionsModel.find(data, null, { skip: offset, limit: opts['limit'] }).sort({ createdAt: -1 }).exec();
        if (ret && ret.length) {
            let arr = [];
            for (const item of ret) {
                arr[arr.length] = item.toJSON();
            }
            return arr;
        }
        return ret;
    });
}
exports.findAllTransaction = findAllTransaction;
function updateTransaction(txid, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield userTransactionsModel.findOneAndUpdate({ txid }, data, { new: true }).exec();
        if (ret)
            return ret.toJSON();
        return ret;
    });
}
exports.updateTransaction = updateTransaction;
// ------- userTradings --------
function insertUserTrading(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let UserTradingsModel = new userTradingsModel();
        UserTradingsModel.address = data.address;
        UserTradingsModel.MANAamount = data.MANAamount;
        UserTradingsModel.ETHamount = data.ETHamount;
        UserTradingsModel.paymentType = data.paymentType;
        UserTradingsModel.txHash = data.txHash;
        UserTradingsModel = yield UserTradingsModel.save();
        return UserTradingsModel.toJSON();
    });
}
exports.insertUserTrading = insertUserTrading;
function updateUserTrading(txHash, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield userTradingsModel.findOneAndUpdate({ txHash }, data, { new: true }).exec();
        if (ret)
            return ret.toJSON();
        return ret;
    });
}
exports.updateUserTrading = updateUserTrading;
function findAllConfirmedTrading(opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        opts['limit'] = opts['limit'] || 10;
        opts['page'] = opts['page'] || 1;
        const offset = (opts['page'] - 1) * opts['limit'];
        let ret = yield userTradingsModel.find({ confirmed: 1 }, null, { skip: offset, limit: opts['limit'] }).sort({ createdAt: -1 }).exec();
        if (ret && ret.length) {
            let arr = [];
            for (const item of ret) {
                arr[arr.length] = item.toJSON();
            }
            return arr;
        }
        return ret;
    });
}
exports.findAllConfirmedTrading = findAllConfirmedTrading;
function findAllUnConfirmedTrading(opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        opts['limit'] = opts['limit'] || 10;
        opts['page'] = opts['page'] || 1;
        const offset = (opts['page'] - 1) * opts['limit'];
        let ret = yield userTradingsModel.find({ confirmed: 0 }, null, { skip: offset, limit: opts['limit'] }).sort({ createdAt: -1 }).exec();
        if (ret && ret.length) {
            let arr = [];
            for (const item of ret) {
                arr[arr.length] = item.toJSON();
            }
            return arr;
        }
        return ret;
    });
}
exports.findAllUnConfirmedTrading = findAllUnConfirmedTrading;
// ------- userPlayInfos --------
function insertPlayInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let PlayInfoModel = new userPlayInfosModel();
        PlayInfoModel.address = data.address || '';
        PlayInfoModel.coinName = data.coinName || '';
        PlayInfoModel.machineID = data.machineID || '';
        PlayInfoModel.landID = data.landID || '';
        PlayInfoModel.betAmount = data.betAmount || 0;
        PlayInfoModel.number = data.number || 0;
        PlayInfoModel.amountWin = data.amountWin || 0;
        PlayInfoModel.txid = data.txid || '';
        PlayInfoModel.type = data.type || '';
        PlayInfoModel = yield PlayInfoModel.save();
        return PlayInfoModel.toJSON();
    });
}
exports.insertPlayInfo = insertPlayInfo;
function findPlayInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var tx = yield userPlayInfosModel.findOne(data).sort({ createdAt: -1 }).exec();
        if (tx)
            return tx.toJSON();
        return tx;
    });
}
exports.findPlayInfo = findPlayInfo;
function findAllPlayInfos(data, limit, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        var opts = {};
        opts['limit'] = limit || 20;
        opts['page'] = page;
        const offset = (opts['page'] - 1) * opts['limit'];
        let ret = yield userPlayInfosModel.find(data, null, { skip: offset, limit: opts['limit'] }).sort({ createdAt: -1 }).exec();
        if (ret && ret.length) {
            let arr = [];
            for (const item of ret) {
                arr[arr.length] = item.toJSON();
            }
            return arr;
        }
        return ret;
    });
}
exports.findAllPlayInfos = findAllPlayInfos;
function updatePlayInfo(filter, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield userPlayInfosModel.findOneAndUpdate(filter, data, { new: true }).exec();
        if (ret)
            return ret.toJSON();
        return ret;
    });
}
exports.updatePlayInfo = updatePlayInfo;
// ------- userPlayerInfos --------
function insertPlayerInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let PlayerInfoModel = new userPlayerInfosModel();
        PlayerInfoModel.address = data.address || '';
        PlayerInfoModel.type = data.type || '';
        PlayerInfoModel.totalBetAmount = data.totalBetAmount || 0;
        PlayerInfoModel.totalAmountWin = data.totalAmountWin || 0;
        PlayerInfoModel.latestSessionDate = data.latestSessionDate || null;
        PlayerInfoModel.numberOfFreePlays = data.numberOfFreePlays || 0;
        PlayerInfoModel.numberOfPayoutPlays = data.numberOfPayoutPlays || 0;
        PlayerInfoModel = yield PlayerInfoModel.save();
        return PlayerInfoModel.toJSON();
    });
}
exports.insertPlayerInfo = insertPlayerInfo;
function findPlayerInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var tx = yield userPlayerInfosModel.findOne(data).exec();
        if (tx)
            return tx.toJSON();
        return tx;
    });
}
exports.findPlayerInfo = findPlayerInfo;
function updatePlayerInfo(filter, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield userPlayerInfosModel.findOneAndUpdate(filter, data, { new: true }).exec();
        if (ret)
            return ret.toJSON();
        return ret;
    });
}
exports.updatePlayerInfo = updatePlayerInfo;
// ------- machineInfos --------
function insertMachineInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let MachineInfoModel = new machineInfosModel();
        MachineInfoModel.playerAddresse = data.playerAddresse || '';
        MachineInfoModel.type = data.type || '';
        MachineInfoModel.machineID = data.machineID || '';
        MachineInfoModel.landID = data.landID || '';
        MachineInfoModel = yield MachineInfoModel.save();
        return MachineInfoModel.toJSON();
    });
}
exports.insertMachineInfo = insertMachineInfo;
function findMachineInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var tx = yield machineInfosModel.findOne(data).exec();
        if (tx)
            return tx.toJSON();
        return tx;
    });
}
exports.findMachineInfo = findMachineInfo;
function findAllMachineInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var opts = {};
        let ret = yield machineInfosModel.find(data, null, { skip: 0 }).sort({ createdAt: -1 }).exec();
        if (ret && ret.length) {
            let arr = [];
            for (const item of ret) {
                arr[arr.length] = item.toJSON();
            }
            return arr;
        }
        return ret;
    });
}
exports.findAllMachineInfo = findAllMachineInfo;
function findAllMachines() {
    return __awaiter(this, void 0, void 0, function* () {
        var opts = {};
        let ret = yield machineInfosModel.find({}, null, { skip: 0 }).distinct('machineID').exec();
        return ret;
    });
}
exports.findAllMachines = findAllMachines;
// ------- machineTotalInfos --------
function insertMachineTotalInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let machineTotalInfoModel = new machineTotalInfosModel();
        machineTotalInfoModel.machineID = data.machineID || '';
        machineTotalInfoModel.landID = data.landID || '';
        machineTotalInfoModel.type = data.type || '';
        machineTotalInfoModel.totalBetAmount = data.totalBetAmount || 0;
        machineTotalInfoModel.totalAmountWin = data.totalAmountWin || 0;
        machineTotalInfoModel.latestSessionDate = data.latestSessionDate || null;
        machineTotalInfoModel = yield machineTotalInfoModel.save();
        return machineTotalInfoModel.toJSON();
    });
}
exports.insertMachineTotalInfo = insertMachineTotalInfo;
function updateMachineTotalInfo(filter, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = yield machineTotalInfosModel.findOneAndUpdate(filter, data, { new: true }).exec();
        if (ret)
            return ret.toJSON();
        return ret;
    });
}
exports.updateMachineTotalInfo = updateMachineTotalInfo;
function findMachineTotalInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var tx = yield machineTotalInfosModel.findOne(data).exec();
        if (tx)
            return tx.toJSON();
        return tx;
    });
}
exports.findMachineTotalInfo = findMachineTotalInfo;
function findAllMachineTotalInfo(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var opts = {};
        let ret = yield machineTotalInfosModel.find(data, null, { skip: 0 }).exec();
        if (ret && ret.length) {
            let arr = [];
            for (const item of ret) {
                arr[arr.length] = item.toJSON();
            }
            return arr;
        }
        return ret;
    });
}
exports.findAllMachineTotalInfo = findAllMachineTotalInfo;
