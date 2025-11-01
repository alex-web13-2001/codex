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

const invitationEmail = (projectName, token, inviterName, role) => ({
  subject: `Приглашение в проект «${projectName}»`,
  text: `${inviterName} пригласил вас в проект ${projectName} с ролью ${role}. Откройте ссылку: ${env.clientUrl}/invitations/${token}`,
  html: `
    <p>${inviterName} пригласил вас присоединиться к проекту <b>${projectName}</b>.</p>
    <p>Вам назначена роль: <b>${role}</b>.</p>
    <p><a href="${env.clientUrl}/invitations/${token}">Принять приглашение</a></p>
  `,
});

module.exports = {
  verificationEmail,
  resetPasswordEmail,
  invitationEmail,
};
