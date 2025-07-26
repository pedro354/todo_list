// app.js
import { message } from './dom.js';
import { getTasksApi } from './api.js';

export async function renderTasks() {
    try {
        const tasks = await getTasksApi();
        message(tasks);
    } catch (error) {
        console.error('Erro ao carregar tarefas: ', error);
    }
}


document.addEventListener('DOMContentLoaded', renderTasks);
