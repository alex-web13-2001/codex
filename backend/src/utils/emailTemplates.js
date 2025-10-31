const env = require('../config/env');

const verificationEmail = (token) => {
  return {
    subject: 'Verify your email',
    text: `Confirm your account: ${env.clientUrl}/verify-email?token=${token}`,
    html: `<p>Confirm your account:</p><p><a href="${env.clientUrl}/verify-email?token=${token}">Verify Email</a></p>`,
  };
};

const resetPasswordEmail = (token) => {
  return {
    subject: 'Reset your password',
    text: `Reset link: ${env.clientUrl}/reset-password?token=${token}`,
    html: `<p>Reset your password:</p><p><a href="${env.clientUrl}/reset-password?token=${token}">Reset Password</a></p>`,
  };
};

const invitationEmail = (projectName, token) => ({
  subject: `Invitation to ${projectName}`,
  text: `You have been invited to ${projectName}: ${env.clientUrl}/invitations/${token}`,
  html: `<p>You have been invited to <b>${projectName}</b></p><p><a href="${env.clientUrl}/invitations/${token}">Accept invitation</a></p>`,
});

module.exports = {
  verificationEmail,
  resetPasswordEmail,
  invitationEmail,
};
