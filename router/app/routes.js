const express = require('express');
const taskController = require('../../controllers/taskController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();
// Página inicial
router.get('/', (req, res) => res.render('pages/home'))

// Listas
router.get('/app', authMiddleware, taskController.index)
router.get('/app/create', authMiddleware, taskController.create);
router.post('/app/new-list-task', authMiddleware, taskController.save);
router.get('/app/:listId', authMiddleware, taskController.show);
router.post('/app/:listId/delete', authMiddleware, taskController.deleteList);
// Tarefas
router.post('/app/:listId/new-task', authMiddleware, taskController.addTask);
router.post('/app/:listId/completed/:taskId', authMiddleware, taskController.completeTask);
router.post('/app/:listId/undo/:taskId', authMiddleware, taskController.undoTask);
router.post('/app/:listId/delete/:taskId', authMiddleware, taskController.deleteTask);
// 


module.exports = router;

