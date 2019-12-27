// prod.js - production keys here

module.exports = {
  WALLET_ADDRESS: process.env.WALLET_ADDRESS,
  WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
  RELAYER_ADDRESS: process.env.RELAYER_ADDRESS,
  RELAYER_PRIVATE_KEY: process.env.RELAYER_PRIVATE_KEY,
  SLOTS_MANA_ADDRESS: process.env.SLOTS_ADDRESS_MANA,
  ROULETTE_MANA_ADDRESS: process.env.ROULETTE_ADDRESS_MANA,
  GAS_PRICE: process.env.GAS_PRICE,
  GAS_LIMIT: process.env.GAS_LIMIT,
  GAS_FEE_AMOUNT: process.env.GAS_FEE_AMOUNT
};
