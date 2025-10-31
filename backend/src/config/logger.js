const morgan = require('morgan');
const env = require('./env');

const requestLogger = env.nodeEnv === 'production' ? morgan('combined') : morgan('dev');

module.exports = {
  requestLogger,
};
