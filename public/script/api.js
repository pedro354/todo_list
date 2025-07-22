// api.js
window.base_url = 'http://localhost:3000';

 async function getTasks() {
    const res = await fetch(base_url);
        if (!res.ok) throw new Error('Falha ao buscar tarefa');
    return fetch(env).then(res => res.json());
}

 async function createTask(title) {
    const res = await fetch(base_url, {
        method: 'POST',
        // credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, completed: false })
    })
    if (!res.ok) {
        throw new Error('Erro ao salvar a tarefa!');
    }
    return res.json();
}

 async function deleteTask(taskId) {
    const res = await fetch(`${base_url}/${taskId}`, {
    // credentials: 'include',
        method: 'DELETE',
    })
    if (!res.ok) {
        throw new Error('Erro ao deletar a tarefa!');
    }
    return res.json();
}

