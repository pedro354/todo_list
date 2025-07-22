const express = require('express');
const taskApiController = require("../../controllers/taskApiController");
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();
router.use(authMiddleware);
router.get('/tasks', taskApiController.getTasks)
router.post('/tasks/create', taskApiController.createTask)
router.delete('/tasks/:listId/:taskId', taskApiController.deleteTask);
router.delete('/tasks/lists/:listId', taskApiController.deleteList);
module.exports = router;