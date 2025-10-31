const httpStatus = require('http-status');
const Membership = require('../models/Membership');
const ApiError = require('../utils/ApiError');

const listMembers = (projectId) => Membership.find({ project: projectId }).populate('user');

const updateRole = async (projectId, membershipId, role, currentUser) => {
  const membership = await Membership.findOne({ _id: membershipId, project: projectId });
  if (!membership) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Membership not found');
  }
  if (membership.user.equals(currentUser)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot change own role');
  }
  membership.role = role;
  await membership.save();
  return membership;
};

const removeMember = async (projectId, membershipId, currentUser) => {
  const membership = await Membership.findOne({ _id: membershipId, project: projectId });
  if (!membership) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Membership not found');
  }
  if (membership.user.equals(currentUser)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove yourself');
  }
  await Membership.deleteOne({ _id: membershipId });
};

module.exports = {
  listMembers,
  updateRole,
  removeMember,
};
