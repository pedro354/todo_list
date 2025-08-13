const SubtaskModel = require("../models/SubtaskModel");

const subtaskController = {
    create: async (req, res) => {
        try {
            const taskId = req.params.id;
            const { title } = req.body;
            await SubtaskModel.createSubtask({
                title,
                taskId,
                status: 'pending',
            })
            
            res.redirect(`/app/${taskId}`)
        } catch (error) {
            console.error(error);
            res.status(500).render('pages/500', {
                message: {
                    type: 'error',
                    text: 'Erro ao criar subtarefa.'
                }
            });
        }
    },
    delete: async (req, res) => {
        const subtaskId = req.params.id;
        const taskId = req.body.taskId;
        const deleteSubtask = await SubtaskModel.delete(subtaskId);
        if(!deleteSubtask) return res.status(404).json({message: 'Subtarefa não encontrada'});
        res.redirect(`/app/${taskId}`);
    },
    deleteAllFromTask: async (req, res) => {
        const taskId = req.params.id;
        await SubtaskModel.deleteAllbyTaskId(taskId);
        res.redirect(`/app/${taskId}`);
    }
}
module.exports = subtaskController;