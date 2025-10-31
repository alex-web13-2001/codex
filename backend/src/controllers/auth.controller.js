const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

exports.register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  res
    .status(httpStatus.CREATED)
    .json({ user: user.toJSON(), message: 'Registration successful. Check email to verify account.' });
});

exports.login = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.login(req.body);
  res.status(httpStatus.OK).json({ user: user.toJSON(), tokens });
});

exports.logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id, req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

exports.refreshTokens = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).json({ user: user.toJSON(), tokens });
});

exports.verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.body.token);
  res.status(httpStatus.OK).json({ message: 'Email verified' });
});

exports.resendVerification = catchAsync(async (req, res) => {
  await authService.resendVerification(req.user.id);
  res.status(httpStatus.OK).json({ message: 'Verification email sent' });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(httpStatus.OK).json({ message: 'If account exists, email sent' });
});

exports.resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(httpStatus.OK).json({ message: 'Password updated' });
});
