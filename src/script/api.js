
// api.js
export async function getTasksApi() {
    try {
    const res = await fetch('/api/tasks', {
        method: 'GET',
        credentials: 'include',
        headers: {
         'Content-Type': 'application/json'
        }
    });
        const contentType = res.headers.get('Content-Type');
        if (!res.ok || !contentType.includes('application/json')) {
            const errorText = await res.text();
            console.error('Resposta inesperada:', errorText);
            throw new Error('Resposta não é JSON');
        }
    const data = await res.json();
    return data;


} catch (error) {
        console.error('Erro ao obter tarefas:', error);
        return [];
    }
}

export async function newTaskApi(task) {
    try {
        const res = await fetch(`/api/lists/${task.listId}/tasks`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
    });
    const data = await res.json();
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
    console.log("body: ", body);
    
    try {
        const res = await fetch(`/api/tasks/subtasks/${id}`,{
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        throw new Error('Erro ao atualizar tarefa');
    }
}
console.log("api do update: ", updateSubtaskApi);

