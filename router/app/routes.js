const express = require('express');
const taskController = require('../../controllers/taskController');

const router = express.Router();
// Página inicial
router.get('/', (req, res) => res.render('pages/home'))
// Listas
router.get('/app', taskController.index)
router.get('/app/create', taskController.create)
router.post('/app/new-list-task', taskController.save)
router.get('/app/:listId', taskController.show)
router.post('/app/:listId/delete', taskController.deleteList);
// Tarefas
router.post('/app/:listId/new-task', taskController.addTask)
router.post('/app/:listId/completed/:taskId', taskController.completeTask)
router.post('/app/:listId/undo/:taskId', taskController.undoTask)
router.post('/app/:listId/delete/:taskId', taskController.deleteTask)

module.exports = router;

