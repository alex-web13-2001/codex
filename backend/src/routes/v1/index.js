const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const projectRoute = require('./project.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/projects', projectRoute);

module.exports = router;
