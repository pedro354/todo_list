// app.js
import { message } from './dom.js';
import { getTasksApi } from './api.js';
import messageHandler from '../../middlewares/messageHandler.js';

async function renderTasks() {
    try {
        const tasks = await getTasksApi();
        message(tasks);
    } catch (error) {
        console.error('Erro ao carregar tarefas: ', error);
    }
}
app.use(messageHandler)

document.addEventListener('DOMContentLoaded', renderTasks);

