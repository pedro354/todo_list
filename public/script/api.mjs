export async function getTasksApi() {
    try {
    const data = await apiRequest(`/api/tasks`, {
        method: 'GET'
    });
    return data || [];

} catch (error) {
        console.error('Erro ao obter tarefas:', error);
        return [];
    }
}

export async function newTaskApi(task) {
    try {
        const data = await apiRequest(`/api/lists/${task.listId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(task)
    });
    return data;
    } catch (error) {
        console.error('Erro ao criar nova tarefa:', error);
        throw new Error('Erro ao criar nova tarefa');
    }
}

export async function updateSubtaskApi(id, status, title = null) {
    const body = {status};
    if(title != null){
        body.title = title;
    }
   
    try {
        const data = await apiRequest(`/api/tasks/subtasks/${id}`,{
            method: 'PUT',
            body: JSON.stringify(body)
        })
        return data;
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        throw new Error('Erro ao atualizar tarefa');
    }
}
