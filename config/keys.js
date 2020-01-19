// keys.js - figure out which set of credentials to return

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dev') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}
