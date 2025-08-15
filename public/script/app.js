// app.js (frontend ES6 module)

import { loader, message, messageHandler, tooglerStatus, typeText } from './dom.js';
import { getTasksApi } from './api.js';

export const renderTasks = async () => {
    try {
        const tasks = await getTasksApi();
        message(tasks);
    } catch (error) {
        console.error('Erro ao carregar tarefas: ', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    messageHandler();
    tooglerStatus();

    if (document.body.classList.contains('home')) {
        typeText();
        window.addEventListener('load', loader);
    } else {
        renderTasks();
    }
});