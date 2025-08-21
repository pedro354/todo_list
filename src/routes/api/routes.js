const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const taskApiController = require('../../controllers/taskApiController');

const router = express.Router();
router.get('/tasks!', taskApiController.getTasks)
router.post('/tasks/create', taskApiController.createTask)
router.put('/tasks/subtasks/:id', taskApiController.update);
router.delete('/tasks/:listId/:taskId', taskApiController.deleteTask);
router.delete('/tasks/:listId/:listId', taskApiController.deleteList);

// subtasks

module.exports = router;