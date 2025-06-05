const BASE_URL = "http://localhost:3000/app"; // ou a URL da API quando for produção

export async function getTasks() {
    const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error('Falha ao buscar tarefa');
    return fetch(env).then(res => res.json());
}

export async function createTask(title) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, completed: false })
    })
    if (!res.ok) {
        throw new Error('Erro ao salvar a tarefa!');
    }
    return res.json();
}

export async function deleteTask(taskId) {
    const res = await fetch(`${BASE_URL}/${taskId}`, {
        method: 'DELETE',
    })
    if (!res.ok) {
        throw new Error('Erro ao deletar a tarefa!');
    }
    return res.json();
}
export default {
    getTasks,
    createTask,
    deleteTask
}