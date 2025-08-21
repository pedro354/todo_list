const SubtaskModel = require("../models/SubtaskModel")
const TaskModel = require("../models/TaskModel")

const taskApiController = {
getTasks: async (req, res) => {
    try {
        console.log("Rota /api/tasks acessada");
        const tasks = await TaskModel.findAllTasks();
        console.log("Tasks carregadas:", tasks);
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Erro detalhado ao buscar tarefas:", error);
        res.status(400).json({ message: "Erro ao buscar tarefas!", error: error.message });
    }
},
    createTask: async (req, res) => {
        try {
            const { title, user_id } = req.body
            const newTask = await TaskModel.createTask(title, user_id)
            res.status(200).json(newTask)
        } catch (error) {
            res.status(400).json({ message: "Erro ao criar tarefa" })
        }
    },
    update: async (req, res) => {
        const { id } = req.params        
        const { title, status } = req.body
        
        if (!id) return res.status(400).json({ message: "ID da subtarefa não informado!" });
        try {
            const updateSubTask = await SubtaskModel.update(id, {title, status})
            console.log('body', req.body);
            res.status(200).json({success: true, task: updateSubTask })
        } catch (error) {
            console.error(error)
            res.status(400).json({ message: "Erro ao atualizar tarefa" })            
        }
    },
    deleteTask: async (req, res) => {
        try {
            const { taskId } = req.params;
            await TaskModel.deleteTask(taskId);
            res.status(200).json({ message: "Tarefa deletada com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Erro ao deletar tarefa" });
        }
    },
    deleteList: async (req, res) => {
        try {
            const { listId } = req.params
            await TaskModel.deleteList(listId)
            res.status(200).json({ message: "Lista deletada com sucesso" })
        } catch (error) {
            res.status(400).json({ message: "Erro ao deletar lista" })
        }
    }
}

module.exports = taskApiController

