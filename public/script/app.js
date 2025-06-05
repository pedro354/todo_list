import dom from './dom.js'
import api from './api.js'

document.addEventListener('click', async (ev) => {
    if (ev.target.classList.contains('deleteBtn')) {
        ev.preventDefault()
        const listId = ev.target.dataset.taskId
        const confirmation = confirm('Tem certeza que deseja deletar todas as tarefas?')
        if (confirmation === true) {
            try {
                await api.deleteTask(listId);
                dom.removeTaskFromDOM(listId);
                alert(`Tarefa ${listId} deletada com sucesso!`);
            } catch (error) {
                alert('Erro ao deletar a tarefa.');
                console.error(error);
            }
        }
    }
})

const App = {
    async initializeApp() {
        dom.showLoading('Carregando...')
        try {
            const tasks = await api.getTasks();
            dom.hideLoading();
            if(tasks.length === 0){
                dom.showEmptyMessage('Não há tarefas para mostrar')
            } else {
                dom.renderTasks(tasks);
            }
        } catch (error) {
            dom.showError('Erro ao carregar as tarefas');
        }
    }
}

App.initializeApp();