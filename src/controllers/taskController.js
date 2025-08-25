const SubtaskModel = require("../models/SubtaskModel");
const TaskModel = require("../models/TaskModel");

const taskController = {
    getApp: async (req, res, next) => {
        console.log('Entrou no controller da rota /app');
        try {
            const user = req.session.currentUser;
            let tasks = [];
            
            // Se usuário logado, buscar suas tarefas
            if (user && !user.guest) {
                tasks = await TaskModel.findTasksByUserId(user.id);
            }
            
            res.render('pages/app', { 
                user,
                tasks,
                message: null
            });
        } catch (error) {
            console.error('Erro no getApp:', error);
            res.render('pages/app', {
                user: req.session.currentUser,
                tasks: [],
                message: {
                    type: 'error',
                    text: 'Erro ao carregar aplicação!'
                }
            });
        }
    },

    index: async (req, res) => {
        try {
            const user = req.session.currentUser;
            let tasks = [];
            
            if (user && !user.guest) {
                tasks = await TaskModel.findTasksByUserId(user.id);
            }
            
            res.render('pages/app', { tasks, user, message: null });
        } catch (error) {
            console.error('Erro no index:', error);
            res.render('pages/app', {
                tasks: [],
                user: req.session.currentUser,
                message: {
                    type: 'error',
                    text: 'Erro ao buscar tarefas!'
                }
            });
        }
    },

    read: async (req, res) => {
        try {
            const user = req.session.currentUser;
            let tasks = [];
            
            if (user && !user.guest) {
                tasks = await TaskModel.findTasksByUserId(user.id);
            }
            
            res.render('pages/app', { tasks, user, message: null });
        } catch (error) {
            console.error('Erro no read:', error);
            res.render('pages/app', {
                tasks: [],
                user: req.session.currentUser,
                message: {
                    type: 'error',
                    text: 'Erro ao buscar tarefas!'
                }
            });
        }
    },

    create: async (req, res) => {
        try {
            const user = req.session.currentUser;
            res.render('pages/create', { user, message: null });
        } catch (error) {
            console.error('Erro no create:', error);
            res.render('pages/create', {
                user: req.session.currentUser,
                message: {
                    type: 'error',
                    text: 'Erro ao carregar página de criação!'
                }
            });
        }
    },

    save: async (req, res) => {
        try {
            const { title } = req.body;
            const userId = req.session.currentUser.id;
            
            if (!title || !userId) {
                throw new Error('Dados inválidos');
            }
            
            await TaskModel.create({ title, userId });
            res.redirect('/app');
        } catch (error) {
            console.error("Erro ao criar a tarefa:", error);
            res.render('pages/create', {
                user: req.session.currentUser,
                message: {
                    type: 'error',
                    text: 'Erro ao criar a tarefa!'
                }
            });
        }
    },

    show: async (req, res) => {
        console.log('Valor recebido para ID:', req.params.taskId);
        console.log('Tipo do ID:', typeof req.params.taskId);
        
        try {
            const taskId = parseInt(req.params.taskId, 10);
            const user = req.session.currentUser;
            
            if (isNaN(taskId)) {
                throw new Error('ID de tarefa inválido');
            }
            
            const task = await TaskModel.findTaskById(taskId);
            const subtasks = await SubtaskModel.findSubtasksByTaskId(taskId);

            if (!task) {
                return res.status(404).render('pages/show', {
                    user,
                    task: null,
                    subtasks: [],
                    message: {
                        type: 'error',
                        text: 'Tarefa não encontrada.'
                    }
                });
            }

            return res.render('pages/show', {
                user,
                task,
                subtasks,
                message: {
                    type: 'success',
                    text: 'Tarefa encontrada com sucesso!'
                }
            });
        } catch (error) {
            console.error("Erro ao buscar a tarefa:", error);
            return res.status(500).render('pages/show', {
                user: req.session.currentUser,
                task: null,
                subtasks: [],
                message: {
                    type: 'error',
                    text: 'Erro ao buscar a tarefa.'
                }
            });
        }
    },

    delete: async (req, res) => {
        try {
            const taskId = parseInt(req.params.taskId, 10);
            
            if (isNaN(taskId)) {
                throw new Error('ID de tarefa inválido');
            }
            
            const task = await TaskModel.findTaskById(taskId);
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
            
            await TaskModel.delete(taskId);
            res.redirect('/app');
        } catch (error) {
            console.error("Erro ao deletar a tarefa:", error);
            res.status(500).render('pages/500', {
                user: req.session.currentUser,
                message: {
                    type: 'error',
                    text: 'Erro ao deletar a tarefa.'
                }
            });
        }
    }
};

module.exports = taskController;