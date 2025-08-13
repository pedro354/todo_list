const TaskModel = require("../models/TaskModel");

(async () => {
  try {
    const novaTask = await TaskModel.createTask(
        {
            title: 'Estudar fullstack até a cabeça fritar',
            userId: 1
        }
    );
    console.log('Nova tarefa criada:', novaTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
  }
})();
// erros recebidos: XHRPUT
// http://localhost:3000/api/tasks/subtasks/completed
// [HTTP/1.1 404 Not Found 59ms]

// Erro ao atualizar tarefa: SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data api.js:58:17
// Error ao atualizar no banco de dados: Error: Erro ao atualizar tarefa
//     updateSubtaskApi http://localhost:3000/script/api.js:59
//     tooglerStatus http://localhost:3000/script/dom.js:69
//     tooglerStatus http://localhost:3000/script/dom.js:52
//     tooglerStatus http://localhost:3000/script/dom.js:51
//     <anonymous> http://localhost:3000/script/app.js:18
//     EventListener.handleEvent* http://localhost:3000/script/app.js:16
// dom.js:71:25