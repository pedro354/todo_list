// api.js

const getBaseUrl = () => {
    if(typeof window !== 'undefined') {
        return process.env.NODE_ENV === 'production' 
        ? 'https://todo-list-2cfs.onrender.com' 
        : 'http://localhost:3000';
    } else {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    }
}

const baseUrl = getBaseUrl();


async function apiRequest(endpoint, options = {}) {
    const url = `${baseUrl}/${endpoint}`;

    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const config = {...defaultOptions, ...options};

    try {
        console.log('making request to', url);
        const response = await fetch(url, config);
        console.log('response status', response.status);

        if(response.status === 204){
            return [];
        }
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Expected JSON, got ${contentType}`);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Response data:', data);
        return data;
        
    } catch (error) {
        console.error('❌ API Request failed:', error);
        
        // Se for erro de rede, tenta novamente uma vez
        if (error.message.includes('fetch')) {
            console.log('🔄 Retrying request...');
            try {
                const retryResponse = await fetch(url, config);
                if (retryResponse.ok) {
                    return await retryResponse.json();
                }
            } catch (retryError) {
                console.error('❌ Retry failed:', retryError);
            }
        }
        
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
export async function testApiConnection() {
    try {
        const response = await fetch(`${BASE_URL}/health`, {
            method: 'GET',
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
}


