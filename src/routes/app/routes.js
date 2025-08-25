const express = require('express');
const taskController = require('../../controllers/taskController');
const subtaskController = require('../../controllers/subtaskController');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();
// Página inicial
router.get('/', (req, res) => res.render('pages/home'));

// tarefas
// router.use(authMiddleware);
router.get('/app', taskController.index);
router.get('/app/create', taskController.create);
router.post('/app/new-list-task', taskController.save);
router.get('/app/:taskId', taskController.show);
router.post('/app/:taskId', taskController.delete);

// Subtarefas
router.post('/app/:id/new-task', subtaskController.create);
router.post('/app/:id/delete', subtaskController.delete);
router.post('/app/:id/delete-all-subtasks', subtaskController.deleteAllFromTask);

module.exports = router;


