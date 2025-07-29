// dom.js
export function message(tasks) {
    const emptyContainer = document.getElementById('empty-container');

    if (!emptyContainer) {
    console.warn('⚠️ #empty-container ausente. Ignorando mensagem.');
            return;
    }


    // Checa se a estrutura contém listas com subtasks ou é só uma lista simples
const isSubtaskList = tasks.length > 0 && Object.hasOwn(tasks[0], 'tasks');

    
    let isEmpty;

    if (isSubtaskList) {
        isEmpty = tasks.every(list => list.tasks.length === 0);
    } else {
        isEmpty = tasks.length === 0;
    }

    if (isEmpty) {
        emptyContainer.innerText = 'Nenhuma tarefa encontrada!';
        emptyContainer.style.display = 'block';
    } else {
        emptyContainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const message = document.querySelector('.msg');
    if (message) {
        setTimeout(() => {
            message.style.opacity = 0;
            message.style.transition = 'opacity 1s ease-in-out';
        }, 3000);
    }
});

window.addEventListener('load', () =>{
    if (document.body.classList.contains('home')) {
    document.body.classList.add('loader') 
    } else {
    document.body.classList.remove('loader') 
    }
})