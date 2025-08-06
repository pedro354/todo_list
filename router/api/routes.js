const express = require('express');
const taskApiController = require("../../controllers/taskApiController");
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/tasks', authMiddleware, taskApiController.getTasks)
router.post('/tasks/create', authMiddleware, taskApiController.createTask)
router.put('/tasks/subtasks/:id', authMiddleware, taskApiController.update);
router.delete('/tasks/:listId/:taskId', authMiddleware, taskApiController.deleteTask);
router.delete('/tasks/lists/:listId', authMiddleware, taskApiController.deleteList);

// subtasks

module.exports = router;