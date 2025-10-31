const Membership = require('../models/Membership');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

module.exports = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId;
  if (!projectId) {
    return next();
  }

  if (!req.user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
  }

  const membership = await Membership.findOne({ project: projectId, user: req.user.id });
  if (!membership) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Access denied for project'));
  }

  req.projectMembership = membership;
  return next();
};
