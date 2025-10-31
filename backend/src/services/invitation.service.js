const crypto = require('crypto');
const dayjs = require('dayjs');
const httpStatus = require('http-status');
const Invitation = require('../models/Invitation');
const Membership = require('../models/Membership');
const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');
const templates = require('../utils/emailTemplates');

const createInvitation = async (projectId, user, { email, role }) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const token = crypto.randomBytes(32).toString('hex');
  const invitation = await Invitation.create({
    project: projectId,
    email,
    role,
    token,
    expiresAt: dayjs().add(7, 'day').toDate(),
  });

  const { subject, text, html } = templates.invitationEmail(project.name, token);
  await emailService.sendMail({ to: email, subject, text, html });
  return invitation;
};

const acceptInvitation = async (token, userId) => {
  const invitation = await Invitation.findOne({ token, expiresAt: { $gt: new Date() } });
  if (!invitation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid invitation token');
  }
  await Membership.findOneAndUpdate(
    { project: invitation.project, user: userId },
    { project: invitation.project, user: userId, role: invitation.role },
    { upsert: true, new: true }
  );
  invitation.acceptedAt = new Date();
  await invitation.save();
  return invitation;
};

const listInvitations = (projectId) => Invitation.find({ project: projectId }).sort({ createdAt: -1 });

module.exports = {
  createInvitation,
  acceptInvitation,
  listInvitations,
};
