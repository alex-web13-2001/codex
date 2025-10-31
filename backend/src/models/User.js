const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { hashPassword, verifyPassword } = require('../utils/password');

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true, required: true, lowercase: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    roles: { type: [String], default: ['user'] },
    verificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    refreshTokens: { type: [tokenSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.passwordSalt;
        delete ret.verificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.refreshTokens;
        return ret;
      },
    },
  }
);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.setPassword = async function (password) {
  const { hash, salt } = await hashPassword(password);
  this.passwordHash = hash;
  this.passwordSalt = salt;
};

userSchema.methods.isPasswordMatch = function (password) {
  return verifyPassword(password, this.passwordHash, this.passwordSalt);
};

userSchema.methods.addRefreshToken = function (token, expires) {
  this.refreshTokens.push({ token, expires });
  this.refreshTokens = this.refreshTokens.filter((stored) => dayjs(stored.expires).isAfter(dayjs().subtract(1, 'day')));
  return this.save();
};

userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter((stored) => stored.token !== token);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
