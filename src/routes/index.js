const express = require('express');
const router = express.Router();

const apiRoutes = require('./api/routes');
const appRoutes = require('./app/routes');
const authRoutes = require('./auth/routes');
const userRoutes = require('./user/routes');


router.use('/api', apiRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/', appRoutes);
module.exports = router;

