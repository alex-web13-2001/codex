const crypto = require('crypto');

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = 'sha512';

const hashPassword = async (password, salt = crypto.randomBytes(16).toString('hex')) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEYLEN, DIGEST, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        hash: derivedKey.toString('hex'),
        salt,
      });
    });
  });
};

const verifyPassword = async (password, hash, salt) => {
  const { hash: hashedAttempt } = await hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hashedAttempt, 'hex'), Buffer.from(hash, 'hex'));
};

module.exports = {
  hashPassword,
  verifyPassword,
};
