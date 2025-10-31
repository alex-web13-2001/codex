const express = require('express');
const userController = require('../../controllers/user.controller');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/me', auth(), userController.getMe);
router.patch('/me', auth(), userController.updateMe);

module.exports = router;
