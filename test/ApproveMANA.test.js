const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const sourceMANAToken = require('../ethereum/contracts/MANA/MANAToken.json');
const addressMANAToken = '0xDd1B834a483fD754c8021FF0938f69C1d10dA81F';
const sourceSlotsMANA = '../ethereum/contracts/MANA/SlotsMANA.json';
const addressSlotsMANA = '0x3fe36cf43ce17d29e5adf61bce7b4cf07296df8b';

let accounts;
let contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  contractMANA = await new web3.eth.Contract(
    JSON.parse(sourceMANAToken.interface),
    addressMANAToken
  );

  contractSlotsMANA = await new web3.eth.Contract(
    JSON.parse(sourceSlotsMANA.interface),
    addressSlotsMANA
  );
});

describe('Matic', async () => {
  it('contract exists on Matic', () => {
    assert.ok(contractMANA.options.address);
  });

  it('approves SlotMachineMANA contract for MANA transactions', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
});
