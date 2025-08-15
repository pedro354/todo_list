const express = require('express');
const router = express.Router();

const apiRoutes = require('./api/routes');
const appRoutes = require('./app/routes');
const authRoutes = require('./auth/routes');
const userRoutes = require('./user/routes');


router.use('/', appRoutes);
router.use('/api', apiRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
module.exports = router;

