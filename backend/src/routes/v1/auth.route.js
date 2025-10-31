const express = require('express');
const authController = require('../../controllers/auth.controller');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth(), authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', auth(), authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
