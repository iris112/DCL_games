const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(
  __dirname,
  'contracts/slots',
  'SlotMachineMANA.sol'
);
const source = fs.readFileSync(contractPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

// iterate over the keys in the object
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, `${contract.replace(':', '')}.json`),
    output[contract]
  );
}
