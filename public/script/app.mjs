import { getTasksApi } from './api.mjs';
import { loader, message, messageHandler, tooglerStatus, typeText } from './dom.mjs';
// renderiza tarefas na página app
async function renderTasks() {
    try {
        const tasks = await getTasksApi();
        message(tasks);
    } catch (error) {
        console.error('Erro ao carregar tarefas: ', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    messageHandler();
    tooglerStatus();
    
    if(document.body.classList.contains('home')){
        typeText();
        window.addEventListener('load', loader)
    }else{
        renderTasks();
    }
    
});

export { renderTasks };