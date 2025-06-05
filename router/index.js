const express = require('express');
const router = express.Router();

const apiRoutes = require('./api/routes');
const appRoutes = require('./app/routes');


router.use('/api', apiRoutes);
router.use('/', appRoutes);

module.exports = router;

