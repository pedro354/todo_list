// dom.js

export function showLoading(message = 'Carregando...') {
    const container = document.getElementById('loading-container');
    container.innerText = message;
    container.style.display = 'block';
}

export function hideLoading() {
    const container = document.getElementById('loading-container');
    container.style.display = 'none';
}

export function showEmptyMessage(message = 'Nenhuma tarefa encontrada.') {
    const container = document.getElementById('empty-container');
    container.innerText = message;
    container.style.display = 'block';
}

export function hideEmptyMessage() {
    const container = document.getElementById('empty-container');
    container.style.display = 'none';
}

export function showError(message = 'Ocorreu um erro.') {
    const container = document.getElementById('error-container');
    container.innerText = message;
    container.style.display = 'block';
}

export function hideError() {
    const container = document.getElementById('error-container');
    container.style.display = 'none';
}

export function renderTasks(tasks) {
    const ul = document.getElementById('taskContainer');
    ul.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');

        li.innerHTML = `
            <a href="/app/${task.id}">
                <h2>${task.title}</h2>
            </a>
            <button class="deleteBtn" data-task-id="${task.id}">Excluir</button>
        `;

        ul.appendChild(li);
    });
}

export function removeTaskFromDOM(taskId) {
    const button = document.querySelector(`.deleteBtn[data-task-id="${taskId}"]`);
    if (button) {
        const li = button.closest('li');
        if (li) li.remove();
    }
}
export default{
    showLoading,
    hideLoading,
    showEmptyMessage,
    hideEmptyMessage,
    showError,
    hideError,
    renderTasks,
    removeTaskFromDOM
}