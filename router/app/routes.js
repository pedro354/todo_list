const express = require('express');
const taskController = require('../../controllers/taskController');
const authMiddleware = require('../../middlewares/authMiddleware');
const subtaskController = require('../../controllers/subtaskController');

const router = express.Router();
// Página inicial

router.get('/', (req, res) => res.render('pages/home'));

// tarefas
router.get('/app', authMiddleware, taskController.index);

router.get('/app/create', authMiddleware, taskController.create);
router.post('/app/new-list-task', authMiddleware, taskController.save);
router.get('/app/:taskId', authMiddleware, taskController.show);
router.post('/app/:taskId', authMiddleware, taskController.delete);

// Subtarefas
router.post('/app/:id/new-task', authMiddleware, subtaskController.create);
router.post('/app/:id/delete', authMiddleware, subtaskController.delete);
router.post('/app/:id/delete-all-subtasks', authMiddleware, subtaskController.deleteAllFromTask);

module.exports = router;


