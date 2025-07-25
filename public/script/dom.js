export function message(tasks) {
    const emptyContainer = document.getElementById('empty-container');

    if (!emptyContainer) {
        console.warn('Elemento #empty-container não encontrado no DOM.');
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

