const crypto = require('crypto');
const dayjs = require('dayjs');
const httpStatus = require('http-status');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateAuthTokens } = require('../utils/token');
const emailService = require('./email.service');
const templates = require('../utils/emailTemplates');
const env = require('../config/env');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const register = async ({ email, password, name }) => {
  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = new User({ email, name, status: 'pending' });
  await user.setPassword(password);

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = hashToken(rawToken);
  await user.save();

  const { subject, text, html } = templates.verificationEmail(rawToken);
  await emailService.sendMail({ to: user.email, subject, text, html });

  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Email is not verified');
  }
  if (user.status === 'disabled') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account disabled');
  }

  const tokens = generateAuthTokens(user.id);
  await user.addRefreshToken(tokens.refresh.token, tokens.refresh.expires);
  user.lastLoginAt = new Date();
  user.status = 'active';
  await user.save();
  return { user, tokens };
};

const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.removeRefreshToken(refreshToken);
};

const refreshAuth = async (refreshToken) => {
  let payload;
  try {
    payload = require('jsonwebtoken').verify(refreshToken, env.jwt.refreshSecret);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  const stored = user.refreshTokens.find((token) => token.token === refreshToken);
  if (!stored || dayjs(stored.expires).isBefore(dayjs())) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  const tokens = generateAuthTokens(user.id);
  user.refreshTokens = user.refreshTokens.filter((token) => token.token !== refreshToken);
  await user.addRefreshToken(tokens.refresh.token, tokens.refresh.expires);
  return { user, tokens };
};

const verifyEmail = async (token) => {
  const user = await User.findOne({ verificationToken: hashToken(token) });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification token');
  }
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.status = 'active';
  await user.save();
  return user;
};

const resendVerification = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const rawToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = hashToken(rawToken);
  await user.save();
  const { subject, text, html } = templates.verificationEmail(rawToken);
  await emailService.sendMail({ to: user.email, subject, text, html });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  const rawToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = hashToken(rawToken);
  user.passwordResetExpires = dayjs().add(1, 'hour').toDate();
  await user.save();
  const { subject, text, html } = templates.resetPasswordEmail(rawToken);
  await emailService.sendMail({ to: user.email, subject, text, html });
};

const resetPassword = async (token, password) => {
  const hashed = hashToken(token);
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired reset token');
  }
  await user.setPassword(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return user;
};

module.exports = {
  register,
  login,
  logout,
  refreshAuth,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
