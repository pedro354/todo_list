const express = require('express');
const router = express.Router();

const apiRoutes = require('./api/routes');
const appRoutes = require('./app/routes');
const authRoutes = require('./auth/routes');


router.use('/api', apiRoutes);
router.use('/', appRoutes);
router.use('/auth', authRoutes);
module.exports = router;

