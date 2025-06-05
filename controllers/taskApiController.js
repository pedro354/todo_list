const taskModel = require("../models/taskModel")

const taskApiController = {
    getTasks: (req, res) => {
        try {
            const tasks = taskModel.getAllTasks()
            res.status(200).json(tasks)
        } catch (error) {
            res.status(400).json({ message: "Erro ao buscar tarefas" })
        }
    },
    createTask: (req, res) => {
        try {
            const { title } = req.body
            const newTask = taskModel.createTask(title)
            res.status(200).json(newTask)
        } catch (error) {
            res.status(400).json({ message: "Erro ao criar tarefa" })
        }
    },
    deleteTask: (req, res) => {
        try {
            const { listId, taskId } = req.params;
            taskModel.deleteTask(listId, taskId);
            res.status(200).json({ message: "Tarefa deletada com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Erro ao deletar tarefa" });
        }
    },
    deleteList: (req, res) => {
        try {
            const { listId } = req.params
            taskModel.deleteList(listId)
            res.status(200).json({ message: "Lista deletada com sucesso" })
        } catch (error) {
            res.status(400).json({ message: "Erro ao deletar lista" })
        }
    }
}

module.exports = taskApiController