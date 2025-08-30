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
        try {
            
            const subtaskId = req.params.id;
            const taskId = req.body.taskId;
            const deleteSubtask = await SubtaskModel.delete(subtaskId);
            if(!deleteSubtask) return res.status(404).json({message: 'Subtarefa não encontrada'});
            req.session.message = {
                type: 'success',
                text: 'Subtarefa deletada com sucesso!'
            };
            res.redirect(`/app/${taskId}`);
        } catch (error) {
        console.error('❌ Erro ao deletar subtask:', error);
        
        req.session.message = {
            type: 'error',
            content: 'Erro ao deletar subtarefa. Tente novamente.'
        };
        
        res.redirect(`/app/${req.body.taskId || req.params.id}`);
    
        }
    },
    deleteAllFromTask: async (req, res) => {
    try {
        const taskId = req.params.id;
        
        console.log(`🗑️ Controller: Iniciando deleção de subtasks da task: ${taskId}`);
        
        const result = await SubtaskModel.deleteAllbyTaskId(taskId);
        
        console.log(`✅ Controller: ${result.deletedCount} subtarefas deletadas`);
        
        req.session.message = {
            type: 'success',
            content: `${result.deletedCount} subtarefa(s) deletada(s) com sucesso!`
        };
        
        console.log(`🔄 Redirecionando para: /app/${taskId}`);
        res.redirect(`/app/${taskId}`);
        
    } catch (error) {
        console.error('❌ Controller: Erro ao deletar subtarefas:', error);
        console.error('❌ Stack trace:', error.stack);
        
        req.session.message = {
            type: 'error', 
            content: 'Erro ao deletar subtarefas. Tente novamente.'
        };
        
        const taskId = req.params.id;
        console.log(`🔄 Erro: Redirecionando para: /app/${taskId}`);
        res.redirect(`/app/${taskId}`);
    }
    }    

}
module.exports = subtaskController;