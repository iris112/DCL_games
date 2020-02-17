import mongoose from 'mongoose';
const Int32 = require('mongoose-int32');

mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(
    'mongodb+srv://stepan:2I5KCpA55fkTOq7x@decentralgames-w8m2c.mongodb.net/DCL_Production?retryWrites=true&w=majority',
    { useNewUrlParser: true },
    function(err) {
      // if we failed to connect, abort
      if (err) console.log(err);
      else console.log('mongoDB Connected');
    }
  );
} else {
  mongoose.connect(
    'mongodb+srv://stepan:2I5KCpA55fkTOq7x@decentralgames-w8m2c.mongodb.net/DCL_Dev?retryWrites=true&w=majority',
    { useNewUrlParser: true },
    function(err) {
      // if we failed to connect, abort
      if (err) console.log(err);
      else console.log('mongoDB Connected');
    }
  );
}
const connection = mongoose.connection;
// const autoIncrement = require('mongoose-auto-increment');

// autoIncrement.initialize(connection);

const Schema = mongoose.Schema;

const userAddresses = new Schema(
  {
    address: { type: String, default: '', unique: true, index: true },
    MANALocked: { type: Schema.Types.Decimal128, default: 0 },
    ETHLocked: { type: Schema.Types.Decimal128, default: 0 },
    verifyStep: { type: Int32, default: 1 },
    authorized: { type: Int32, default: 0 },
    email: { type: String, default: '' },
    name: { type: String, default: '' },
    gasFill: { type: Int32, default: 0 }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'userAddresses'
  }
);

userAddresses.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.MANALocked) ret.MANALocked = Number(ret.MANALocked.toString());
    if (ret.ETHLocked) ret.ETHLocked = Number(ret.ETHLocked.toString());
    return ret;
  }
});

const userIndexings = new Schema(
  {
    address: { type: String, default: '', index: true },
    page: { type: Int32, default: 0, index: true },
    historyID: { type: Schema.Types.ObjectId, default: null },
    playID: { type: Schema.Types.ObjectId, default: null }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'userIndexings'
  }
);

const userTransactions = new Schema(
  {
    address: { type: String, default: '' },
    txid: { type: String, default: '', unique: true, index: true },
    amount: { type: Schema.Types.Decimal128, default: 0 },
    type: { type: String, default: '' },
    status: { type: String, default: '' },
    step: { type: Int32, default: 0 }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'userTransactions'
  }
);

userTransactions.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.amount) ret.amount = Number(ret.amount.toString());
    return ret;
  }
});

const userTradings = new Schema(
  {
    address: { type: String, default: '' },
    MANAamount: { type: Schema.Types.Decimal128, default: 0 },
    ETHamount: { type: Schema.Types.Decimal128, default: 0 },
    paymentType: { type: String, default: '' },
    txHash: { type: String, default: '', unique: true, index: true },
    confirmed: { type: Int32, default: 0 }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'userTradings'
  }
);

userTradings.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.MANAamount) ret.MANAamount = Number(ret.MANAamount.toString());
    if (ret.ETHamount) ret.ETHamount = Number(ret.ETHamount.toString());
    return ret;
  }
});

const userPlayInfos = new Schema(
  {
    address: { type: String, default: '' },
    coinName: { type: String, default: '' },
    betAmount: { type: Schema.Types.Decimal128, default: 0 },
    machineID: { type: String, default: '' },
    landID: { type: String, default: '' },
    number: { type: Int32, default: 0 },
    amountWin: { type: Schema.Types.Decimal128, default: 0 },
    txid: { type: String, default: '' },
    type: { type: String, default: '' }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'userPlayInfos'
  }
);

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
    if (ret.betAmount) ret.betAmount = Number(ret.betAmount.toString());
    if (ret.amountWin) ret.amountWin = Number(ret.amountWin.toString());
    return ret;
  }
});

const userPlayerInfos = new Schema(
  {
    address: { type: String, default: '', unique: true, index: true },
    type: { type: String, default: '' },
    totalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    totalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    latestSessionDate: { type: Date, default: null },
    numberOfFreePlays: { type: Int32, default: 0 },
    numberOfPayoutPlays: { type: Int32, default: 0 }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'userPlayerInfos'
  }
);

userPlayerInfos.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.totalBetAmount)
      ret.totalBetAmount = Number(ret.totalBetAmount.toString());
    if (ret.totalAmountWin)
      ret.totalAmountWin = Number(ret.totalAmountWin.toString());
    return ret;
  }
});

const machineInfos = new Schema(
  {
    playerAddresse: { type: String, default: '' },
    machineID: { type: String, default: '' },
    landID: { type: String, default: '' },
    type: { type: String, default: '' }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'machineInfos'
  }
);

const machineTotalInfos = new Schema(
  {
    machineID: { type: String, default: '' },
    landID: { type: String, default: '' },
    type: { type: String, default: '' },
    totalBetAmount: { type: Schema.Types.Decimal128, default: 0 },
    totalAmountWin: { type: Schema.Types.Decimal128, default: 0 },
    latestSessionDate: { type: Date, default: null }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    collection: 'machineTotalInfos'
  }
);

machineTotalInfos.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.totalBetAmount)
      ret.totalBetAmount = Number(ret.totalBetAmount.toString());
    if (ret.totalAmountWin)
      ret.totalAmountWin = Number(ret.totalAmountWin.toString());
    return ret;
  }
});

const userAddressesModel = connection.model('userAddresses', userAddresses);
const userTransactionsModel = connection.model(
  'userTransactions',
  userTransactions
);
const userTradingsModel = connection.model('userTradings', userTradings);
const userPlayInfosModel = connection.model('userPlayInfos', userPlayInfos);
const userPlayerInfosModel = connection.model(
  'userPlayerInfos',
  userPlayerInfos
);
const machineInfosModel = connection.model('machineInfos', machineInfos);
const machineTotalInfosModel = connection.model(
  'machineTotalInfos',
  machineTotalInfos
);
const userIndexingsModel = connection.model('userIndexings', userIndexings);

async function initDb() {
  // This produce empty db item. so disable temporarily.
  // await new userAddressesModel().save()
  // await new userTransactionsModel().save()
  // await new userTradingsModel().save()
  // await new userEmailsModel().save()
}
// ------------- userIndexings -------------------
async function insertUserIndexing(data) {
  let UserIndexingsModel = new userIndexingsModel();

  UserIndexingsModel.address = data.address || '';
  UserIndexingsModel.page = data.page || 0;
  UserIndexingsModel.historyID = data.historyID || null;
  UserIndexingsModel.playID = data.playID || null;

  UserIndexingsModel = await UserIndexingsModel.save();
  return UserIndexingsModel;
}

async function findUserIndexing(address, page) {
  var ret = await userIndexingsModel.findOne({ address, page }).exec();
  if (ret) return ret.toJSON();

  return ret;
}

async function updateUserIndexing(address, page, data) {
  let ret = await userIndexingsModel
    .findOneAndUpdate({ address, page }, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();

  return ret;
}

// ------------- userAddresses -------------------
async function insertUser(data) {
  let UserAddressesModel = new userAddressesModel();

  UserAddressesModel.address = data.address || '';
  UserAddressesModel.MANALocked = data.MANALocked || 0;
  UserAddressesModel.ETHLocked = data.ETHLocked || 0;
  UserAddressesModel.email = data.email || '';
  UserAddressesModel.name = data.name || '';
  UserAddressesModel.verifyStep = data.verifyStep || 1;
  UserAddressesModel.authorized = data.authorized || 0;
  UserAddressesModel.gasFill = data.gasFill || 0;

  UserAddressesModel = await UserAddressesModel.save();
  return UserAddressesModel.toJSON();
}

async function findUser(address) {
  var user = await userAddressesModel.findOne({ address }).exec();

  if (user) return user.toJSON();

  return user;
}

async function updateUser(address, data) {
  let ret = await userAddressesModel
    .findOneAndUpdate({ address }, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();

  return ret;
}

// -------- userTransactions --------
async function insertTransaction(data) {
  let TransactionModel = new userTransactionsModel();

  TransactionModel.address = data.address || '';
  TransactionModel.amount = data.amount || 0;
  TransactionModel.type = data.type || '';
  TransactionModel.status = data.status || '';
  TransactionModel.step = data.step || 0;
  TransactionModel.txid = data.txid || '';

  TransactionModel = await TransactionModel.save();
  return TransactionModel.toJSON();
}

async function findTransaction(txid) {
  var tx = await userTransactionsModel.findOne({ txid }).exec();

  if (tx) return tx.toJSON();

  return tx;
}

async function findAllTransaction(data, opts = {}) {
  var limit = opts['limit'] || 20;

  let ret = await userTransactionsModel
    .find(data, null, { limit: limit })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }

    return arr;
  }

  return ret;
}

async function updateTransaction(txid, data) {
  let ret = await userTransactionsModel
    .findOneAndUpdate({ txid }, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();

  return ret;
}

// ------- userTradings --------
async function insertUserTrading(data) {
  let UserTradingsModel = new userTradingsModel();

  UserTradingsModel.address = data.address;
  UserTradingsModel.MANAamount = data.MANAamount;
  UserTradingsModel.ETHamount = data.ETHamount;
  UserTradingsModel.paymentType = data.paymentType;
  UserTradingsModel.txHash = data.txHash;

  UserTradingsModel = await UserTradingsModel.save();
  return UserTradingsModel.toJSON();
}

async function updateUserTrading(txHash, data) {
  let ret = await userTradingsModel
    .findOneAndUpdate({ txHash }, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();

  return ret;
}

async function findAllConfirmedTrading(opts = {}) {
  opts['limit'] = opts['limit'] || 10;
  opts['page'] = opts['page'] || 1;
  const offset = (opts['page'] - 1) * opts['limit'];

  let ret = await userTradingsModel
    .find({ confirmed: 1 }, null, { skip: offset, limit: opts['limit'] })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }

    return arr;
  }

  return ret;
}

async function findAllUnConfirmedTrading(opts = {}) {
  opts['limit'] = opts['limit'] || 10;
  opts['page'] = opts['page'] || 1;
  const offset = (opts['page'] - 1) * opts['limit'];

  let ret = await userTradingsModel
    .find({ confirmed: 0 }, null, { skip: offset, limit: opts['limit'] })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }

    return arr;
  }

  return ret;
}

// ------- userPlayInfos --------
async function insertPlayInfo(data) {
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

  PlayInfoModel = await PlayInfoModel.save();
  return PlayInfoModel.toJSON();
}

async function findPlayInfo(data) {
  var tx = await userPlayInfosModel
    .findOne(data)
    .sort({ createdAt: -1 })
    .exec();

  if (tx) return tx.toJSON();

  return tx;
}

async function findAllPlayInfos(data, opts = {}) {
  var limit = opts['limit'] || 20;

  let ret = await userPlayInfosModel
    .find(data, null, { limit: limit })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }

    return arr;
  }

  return ret;
}

async function updatePlayInfo(filter, data) {
  let ret = await userPlayInfosModel
    .findOneAndUpdate(filter, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();

  return ret;
}

// ------- userPlayerInfos --------
async function insertPlayerInfo(data) {
  let PlayerInfoModel = new userPlayerInfosModel();

  PlayerInfoModel.address = data.address || '';
  PlayerInfoModel.type = data.type || '';
  PlayerInfoModel.totalBetAmount = data.totalBetAmount || 0;
  PlayerInfoModel.totalAmountWin = data.totalAmountWin || 0;
  PlayerInfoModel.latestSessionDate = data.latestSessionDate || null;
  PlayerInfoModel.numberOfFreePlays = data.numberOfFreePlays || 0;
  PlayerInfoModel.numberOfPayoutPlays = data.numberOfPayoutPlays || 0;

  PlayerInfoModel = await PlayerInfoModel.save();
  return PlayerInfoModel.toJSON();
}

async function findPlayerInfo(data) {
  var tx = await userPlayerInfosModel.findOne(data).exec();

  if (tx) return tx.toJSON();

  return tx;
}

async function updatePlayerInfo(filter, data) {
  let ret = await userPlayerInfosModel
    .findOneAndUpdate(filter, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();

  return ret;
}

// ------- machineInfos --------
async function insertMachineInfo(data) {
  let MachineInfoModel = new machineInfosModel();

  MachineInfoModel.playerAddresse = data.playerAddresse || '';
  MachineInfoModel.type = data.type || '';
  MachineInfoModel.machineID = data.machineID || '';
  MachineInfoModel.landID = data.landID || '';

  MachineInfoModel = await MachineInfoModel.save();
  return MachineInfoModel.toJSON();
}

async function findMachineInfo(data) {
  var tx = await machineInfosModel.findOne(data).exec();

  if (tx) return tx.toJSON();

  return tx;
}

async function findAllMachineInfo(data) {
  var opts = {};

  let ret = await machineInfosModel
    .find(data, null, { skip: 0 })
    .sort({ createdAt: -1 })
    .exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }

    return arr;
  }

  return ret;
}

async function findAllMachines() {
  var opts = {};

  let ret = await machineInfosModel
    .find({}, null, { skip: 0 })
    .distinct('machineID')
    .exec();

  return ret;
}

// ------- machineTotalInfos --------
async function insertMachineTotalInfo(data) {
  let machineTotalInfoModel = new machineTotalInfosModel();

  machineTotalInfoModel.machineID = data.machineID || '';
  machineTotalInfoModel.landID = data.landID || '';
  machineTotalInfoModel.type = data.type || '';
  machineTotalInfoModel.totalBetAmount = data.totalBetAmount || 0;
  machineTotalInfoModel.totalAmountWin = data.totalAmountWin || 0;
  machineTotalInfoModel.latestSessionDate = data.latestSessionDate || null;

  machineTotalInfoModel = await machineTotalInfoModel.save();
  return machineTotalInfoModel.toJSON();
}

async function updateMachineTotalInfo(filter, data) {
  let ret = await machineTotalInfosModel
    .findOneAndUpdate(filter, data, { new: true })
    .exec();
  if (ret) return ret.toJSON();

  return ret;
}

async function findMachineTotalInfo(data) {
  var tx = await machineTotalInfosModel.findOne(data).exec();

  if (tx) return tx.toJSON();

  return tx;
}

async function findAllMachineTotalInfo(data) {
  var opts = {};

  let ret = await machineTotalInfosModel.find(data, null, { skip: 0 }).exec();
  if (ret && ret.length) {
    let arr = [];
    for (const item of ret) {
      arr[arr.length] = item.toJSON();
    }

    return arr;
  }

  return ret;
}

// async function deletePendingDeposit(filter) {
//   await accountTransactionsPendingModel.deleteOne(filter).exec();
// }

// async function countDepositAll(filter) {
//   filter.paymentType = 'CR';

//   return accountTransactionsModel.count(filter).exec();
// }

export {
  initDb,
  insertUserIndexing,
  findUserIndexing,
  updateUserIndexing,
  insertUser,
  findUser,
  updateUser,
  insertTransaction,
  findTransaction,
  updateTransaction,
  insertUserTrading,
  updateUserTrading,
  findAllTransaction,
  findAllConfirmedTrading,
  findAllUnConfirmedTrading,
  insertPlayInfo,
  findPlayInfo,
  findAllPlayInfos,
  updatePlayInfo,
  insertPlayerInfo,
  findPlayerInfo,
  updatePlayerInfo,
  insertMachineInfo,
  findMachineInfo,
  findAllMachineInfo,
  findAllMachines,
  insertMachineTotalInfo,
  updateMachineTotalInfo,
  findMachineTotalInfo,
  findAllMachineTotalInfo
};
