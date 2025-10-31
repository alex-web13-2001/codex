const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

exports.getMe = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).json({ user: req.user });
});

exports.updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.status(httpStatus.OK).json({ user });
});
