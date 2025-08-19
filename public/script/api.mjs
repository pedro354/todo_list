// Define a URL fixa do backend (Render)
const baseUrl = 
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"  // dev local
        : "https://todo-list-2cfs.onrender.com"; // produção no Render

async function apiRequest(endpoint, options = {}) {
    const url = `${baseUrl}${endpoint}`;

    const defaultOptions = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    };

    const config = { ...defaultOptions, ...options };

    try {
        console.log('➡️ Fazendo request para', url);
        const response = await fetch(url, config);
        console.log('⬅️ Status da resposta', response.status);

        if (response.status === 204) return [];

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Esperava JSON, veio ${contentType}`);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || `HTTP error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Erro na API:', error);
        throw error;
    }
}

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

