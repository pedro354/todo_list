const taskModel = require("../models/taskModel")

const taskController = {
    //GET /app
    index: (req, res) => {
        const user = req.session.currentUser;
        const tasks = taskModel.getAllTasks().filter(task => task.userId === user.id);
        if(!user || !user.id) {
            return res.redirect('/login')
        }
        res.render('pages/app', { tasks, user })
    },
    // GET /app/nova-lista - exibir a pagina do formulario - redenrizar a tela
    create: (req, res) => {
        const user = req.session.currentUser
        res.render('pages/create', { user });
    },
    //POST /app/nova-lista - destinado a salvar o model 
    save: (req, res) => {
        const { title } = req.body
        const user = req.session.currentUser;
        taskModel.createTask(title, user.id);
        res.redirect('/app')
    },
    // GET /posts/:id
    show: (req, res) => {
        const { listId } = req.params;
        const taskList = taskModel.getTaskListById(listId);
        const user = req.session.currentUser;
        if (!taskList) {
            return res.status(404).send('Lista não encontrada')
        }
        res.render('pages/show', { taskList, user });
    },
    subTask: (req, res) => {
        const listId = req.body.listId || req.params.listId;
        const taskList = taskModel.getTaskListById(listId);
        if (!taskList) return res.status(404).send('Lista não encontrada');
        res.json(taskList.tasks);
    },
    // POST /app/:id/nova-tarefa
    addTask: (req, res) => {
        const { listId } = req.params;
        const { title } = req.body;
        taskModel.addTask(listId, title);
        res.redirect(`/app/${listId}`);
    },
    // POST /app/:listId/completar/:taskId
    completeTask: (req, res) => {
        const { listId, taskId } = req.params;
        taskModel.completeTask(listId, taskId);
        res.redirect(`/app/${listId}`);
    },
    // POST /app/:listId/desfazer/:taskId
    undoTask: (req, res) => {
        const { listId, taskId } = req.params;
        taskModel.undoTask(listId, taskId);
        res.redirect(`/app/${listId}`);
    },

    // POST /app/:id/excluir
    deleteList: (req, res) => {
        // obter o id da rota desestruturando 
        const { listId } = req.params
        // chamando um metodo
        taskModel.deleteList(listId)
        res.redirect(`/app`)

    },
    deleteTask: (req, res) => {
        const { listId, taskId } = req.params
        taskModel.deleteTask(listId, taskId)
        res.redirect(`/app/${listId}`)
    }

}

module.exports = taskController

