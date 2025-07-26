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

window.addEventListener('load', () =>{
    document.body.classList.add('loader')
})