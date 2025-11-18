const e = require("express");
const SubtaskModel = require("../models/SubtaskModel");
const TaskModel = require("../models/TaskModel");

const taskController = {

    index: async (req, res) => {
        console.log("Sessão na rota /app:", req.session);

        try {
            const user = req.session.currentUser;
            const tasks = await TaskModel.findTasksByUserId(user.id);
            res.render('pages/app', { user, tasks });
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            res.status(500).render('pages/500', { message: 'Erro ao carregar tarefas!' });
        }
    },

    create: async (req, res) => {
        const user = req.session.currentUser;
        // res.send('Página de criação de nova tarefa', { user });
        res.render('pages/create', { user })
    },
    save: async (req, res) => {
        try {
            const { title } = req.body
            const userId = req.session.currentUser.id;
            await TaskModel.create({ title, userId });

            res.redirect('/app');
        } catch (error) {
            console.error("Erro ao criar a tarefa: ", error);
            res.render('pages/create', {
                tasks: [],
                message: {
                    type: 'error',
                    text: 'Erro ao criar a tarefa!'
                }
            });

        }
    },
    show: async (req, res) => {
        const taskId = parseInt(req.params.taskId, 10);
        const user = req.session.currentUser;
        const task = await TaskModel.findTaskById(taskId);
        const subtasks = await SubtaskModel.findSubtasksByTaskId(taskId);

        try {

            if (!task) {
                return res.status(404).render('pages/show', {
                    user,
                    task,
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
            console.error("Erro ao buscar a tarefa: ", error);
            return res.status(500).render('pages/show', {
                user,
                message: {
                    type: 'error',
                    text: 'Erro ao buscar a tarefa.'
                }
            });
        }
    },
    // deleta tarefa
    delete: async (req, res) => {
        const taskId = parseInt(req.params.taskId, 10);

        try {
            const tasks = await TaskModel.findTaskById(taskId);
            if (!tasks) throw new Error('Tarefa não encontrada');
            await TaskModel.delete(taskId);
            res.redirect('/app');
        } catch (error) {
            console.error("Erro ao deletar a tarefa: ", error);
            res.status(500).render('pages/500', {
                tasks: null,
                message: {
                    type: 'error',
                    text: 'Erro ao deletar a tarefa.'
                }

            })
        } console.log('Valor recebido para ID:', req.params.taskId);
        console.log('Tipo do ID:', typeof req.params.taskId);

    }

}
module.exports = taskController

