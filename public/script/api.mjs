// api.mjs - FRONTEND CORRIGIDO PARA HTML PURO

// ✅ URL fixa - sempre usa o Render em produção
const baseUrl = "https://todo-list-2cfs.onrender.com";

// ✅ Função de request melhorada
async function apiRequest(endpoint, options = {}) {
    const url = `${baseUrl}${endpoint}`;
    
    const defaultOptions = {
        credentials: 'include',
        mode: 'cors', // ✅ Explicitamente CORS
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        console.log(`📡 ${config.method || 'GET'} -> ${url}`);
        
        const response = await fetch(url, config);
        
        console.log(`📨 Status: ${response.status}`);
        console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
        
        // ✅ Tratamento específico para cada status
        if (response.status === 204) {
            console.log('✅ Resposta vazia (204)');
            return [];
        }
        
        if (response.status >= 400) {
            console.error(`❌ Erro HTTP: ${response.status}`);
            const errorText = await response.text();
            console.error('❌ Erro detalhado:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        // ✅ Verifica se é JSON
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            console.error('❌ Resposta não é JSON:', responseText);
            throw new Error(`Esperava JSON, recebeu: ${contentType}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        
        // ✅ Tratamento específico para erros de CORS
        if (error.message.includes('CORS') || error.message.includes('NetworkError')) {
            console.error('🚫 ERRO DE CORS - Verifique se o servidor está com CORS configurado');
            throw new Error('Erro de conexão com o servidor. Verifique CORS.');
        }
        
        throw error;
    }
}

// ✅ Função para testar CORS
export async function testCors() {
    try {
        const response = await fetch(`${baseUrl}/test-cors`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('✅ CORS funcionando:', data);
        return true;
    } catch (error) {
        console.error('❌ CORS não funcionando:', error);
        return false;
    }
}

// ✅ APIs do seu todo list
export async function getTasksApi() {
    try {
        const data = await apiRequest('/api/tasks', {
            method: 'GET'
        });
        return data || [];
    } catch (error) {
        console.error('❌ Erro ao obter tarefas:', error);
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
        console.error('❌ Erro ao criar tarefa:', error);
        throw error;
    }
}

export async function updateSubtaskApi(id, status, title = null) {
    const body = { status };
    if (title !== null) {
        body.title = title;
    }

    try {
        const data = await apiRequest(`/api/tasks/subtasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        return data;
    } catch (error) {
        console.error('❌ Erro ao atualizar tarefa:', error);
        throw error;
    }
}

// ✅ Função para testar tudo
export async function testAll() {
    console.log('🧪 Testando conexões...');
    
    try {
        // Teste 1: Health check
        const health = await fetch(`${baseUrl}/health`);
        console.log('1️⃣ Health:', health.status);
        
        // Teste 2: CORS
        const corsOk = await testCors();
        console.log('2️⃣ CORS:', corsOk ? '✅' : '❌');
        
        // Teste 3: Tasks
        const tasks = await getTasksApi();
        console.log('3️⃣ Tasks:', tasks.length, 'encontradas');
        
        return { health: health.ok, cors: corsOk, tasks: Array.isArray(tasks) };
        
    } catch (error) {
        console.error('❌ Teste falhou:', error);
        return { error: error.message };
    }
}