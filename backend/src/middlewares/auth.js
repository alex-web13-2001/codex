const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const auth = (required = true) => async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      if (!required) {
        return next();
      }
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const token = header.replace('Bearer ', '');
    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
  }
};

const authorizeProjectRole = (roles = []) => async (req, res, next) => {
  if (!req.projectMembership || (roles.length && !roles.includes(req.projectMembership.role))) {
    next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient role'));
    return;
  }
  next();
};

module.exports = {
  auth,
  authorizeProjectRole,
};
