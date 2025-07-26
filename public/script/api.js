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