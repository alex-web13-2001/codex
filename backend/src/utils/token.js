const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const env = require('../config/env');

const generateToken = (userId, expires, secret, type) => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = (userId) => {
  const accessTokenExpires = dayjs().add(env.jwt.accessExpirationMinutes, 'minute');
  const refreshTokenExpires = dayjs().add(env.jwt.refreshExpirationDays, 'day');

  const access = {
    token: generateToken(userId, accessTokenExpires, env.jwt.secret, 'access'),
    expires: accessTokenExpires.toDate(),
  };

  const refresh = {
    token: generateToken(userId, refreshTokenExpires, env.jwt.refreshSecret, 'refresh'),
    expires: refreshTokenExpires.toDate(),
  };

  return { access, refresh };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
