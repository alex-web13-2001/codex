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
    status: 'pending',
  });

  const { subject, text, html } = templates.invitationEmail(project.title, token, user.name, role);
  await emailService.sendMail({ to: email, subject, text, html });
  return invitation;
};

const acceptInvitation = async (token, userId) => {
  const invitation = await Invitation.findOne({ token });
  if (!invitation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid invitation token');
  }
  if (invitation.status === 'accepted') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invitation already accepted');
  }
  if (invitation.status === 'revoked') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invitation revoked');
  }
  if (dayjs(invitation.expiresAt).isBefore(dayjs())) {
    invitation.status = 'expired';
    await invitation.save();
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invitation expired');
  }
  await Membership.findOneAndUpdate(
    { project: invitation.project, user: userId },
    { project: invitation.project, user: userId, role: invitation.role },
    { upsert: true, new: true }
  );
  invitation.acceptedAt = new Date();
  invitation.status = 'accepted';
  await invitation.save();
  return invitation;
};

const listInvitations = async (projectId) => {
  const invitations = await Invitation.find({ project: projectId }).sort({ createdAt: -1 });
  const now = dayjs();
  await Promise.all(
    invitations
      .filter((inv) => inv.status === 'pending' && now.isAfter(inv.expiresAt))
      .map(async (inv) => {
        inv.status = 'expired';
        await inv.save();
      })
  );
  return invitations;
};

module.exports = {
  createInvitation,
  acceptInvitation,
  listInvitations,
};
