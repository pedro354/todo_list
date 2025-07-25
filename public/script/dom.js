export function message(tasks) {
    const emptyContainer = document.getElementById('empty-container');
    
    if (!emptyContainer) {
        console.warn('Elemento #empty-container não encontrado no DOM.');
        return;
    }
    // Verifica se tasks é um array e se está vazio ou se todos os itens têm zero tarefas!
    const isEmpty = Array.isArray(tasks) && tasks.every(list => list.tasks.length === 0);
    // Se estiver vazio, exibe a mensagem
    if (isEmpty) {
        emptyContainer.innerText = 'Nenhuma tarefa encontrada!';
        emptyContainer.style.display = 'block';
    } else {
        emptyContainer.style.display = 'none';
    }
}

