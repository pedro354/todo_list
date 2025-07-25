// api.js

export async function getTasksApi() {
    const res = await fetch('/api/tasks', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('Erro na resposta da API');
    }

    return res.json();
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