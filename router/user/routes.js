const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const userController = require('../../controllers/userController');
const router = express.Router();

router.get('/users', authMiddleware, userController.index);
router.get('/users/:userId', authMiddleware, userController.show);
router.post('/users', authMiddleware, userController.save);
router.put('/users/:userId', authMiddleware, userController.update);
// delegação via post por limitação do form HTML
router.post('/users/:userId', authMiddleware, userController.delete);

module.exports = router;