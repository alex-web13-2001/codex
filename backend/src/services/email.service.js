const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  if (!env.smtp.host) {
    return;
  }
  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendMail,
};
