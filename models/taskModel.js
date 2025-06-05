const fs = require('node:fs');


let taskLists = []

function initializeTasks() {
    try {
        const data = fs.readFileSync("data/tasks.json", "utf-8");
        taskLists = JSON.parse(data);
    } catch (error) {
        console.log("Erro ao carregar o arquivo:", error);
        taskLists = [];
    }
}
function saveTasks ()  {
        fs.writeFileSync("data/tasks.json", JSON.stringify(taskLists, null, 2));
    }
const taskModel = {
    // Listar todas as listas
    getAllTasks: () => {
        return taskLists;
    },

    // Buscar uma lista por ID
    getTaskListById: (id) => {
        return taskLists.find(list => list.id === id);
    },


    createTask: (title) => {
        const newList = {
            id: Date.now().toString(),
            title: title,
            tasks: []
        }
        taskLists.push(newList);
        saveTasks();
        return newList;
    },
    saveList: (taskList) => {
        if (taskList.title === "") throw new Error("Title is required");
        taskLists.push(taskList);
        saveTasks();
        return taskList;
    },

    addTask(listId, taskTitle) {
        const list = taskLists.find(list => list.id === listId);
        if (!list) return null;

        const newTask = {
            id: Date.now().toString(),
            title: taskTitle,
            completed: false
        };

        list.tasks.push(newTask);
        saveTasks();
        return newTask;
    },
    completeTask(listId, taskId) {
        const list = taskLists.find(list => list.id === listId);
        if (!list) return null;

        const task = list.tasks.find(task => task.id === taskId);
        if (!task) return null;

        task.completed = true;
        saveTasks();
        return task;
    },

    // ↩️ Desmarcar tarefa (voltar para pendente)
    undoTask(listId, taskId) {
        const list = taskLists.find(list => list.id === listId);
        if (!list) return null;

        const task = list.tasks.find(task => task.id === taskId);
        if (!task) return null;

        task.completed = false;
        saveTasks();
        return task;
    },

    // Deletar uma lista inteira
    deleteTask(listId, taskId) {
        const list = taskLists.find(list => list.id === listId);
        if (!list) return null;

        list.tasks = list.tasks.filter(task => task.id !== taskId);
        saveTasks();
        return list;
    },

    // 🗑️ Deletar uma lista inteira
    deleteList(listId) {
        taskLists = taskLists.filter(list => list.id !== listId);
        saveTasks();
    },
}

initializeTasks();
module.exports = taskModel;
