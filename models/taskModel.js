const { query } = require("../database/db");

class TaskModel  {
    // Mapeia os dados da linha do banco para o objeto da classe
    constructor(taskRow){
        this.id = taskRow.id;
        this.title = taskRow.title;
        this.userId = taskRow.user_id;
    }
    // Busca todas as tarefas da tabela (sem filtro por usuário)
    static async findAllTasks() {
        const result = await query("SELECT * FROM tasks");
        return result.rows.map((row) => new TaskModel(row));
    }
    // Busca uma tarefa pelo id
    static async findTaskById(id) {
        const result = await query("SELECT * FROM tasks WHERE id = $1", [id]);
        if (!result.rows[0]) return null;
        return new TaskModel(result.rows[0]);
    }
    // Busca todas as tarefas de um usuário 
    static async findTasksByUserId(userId) {
        const result = await query("SELECT * FROM tasks WHERE user_id = $1", [userId]
        );
        return result.rows.map((row) => new TaskModel(row));
    }
    // Cria uma nova tarefa no banco de dados
    static async create({ userId, title}) {
        const result = await query(
            `INSERT INTO tasks (title, user_id)
            VALUES ($1, $2)
            RETURNING *`,
            [
                title,
                userId
            ]
        );
        return new TaskModel(result.rows[0]);
    }
    // Atualiza uma tarefa no banco de dados
    static async update(id, attributes ){
        const {rows} = await query(`SELECT * FROM tasks WHERE id = $1;`, [id]);
        if(!rows[0]) return null;

        const task = new TaskModel(rows[0]);
        Object.assign(task, attributes);

        await query(
            `UPDATE tasks SET
            title = $1
            WHERE id = $2
            RETURNING *`,
            [
                task.title,
                task.id
            ] 
        );        
        return task;
    }
    // Deleta uma tarefa do banco de dados
    static async delete(taskId) {
        await query(`DELETE FROM tasks WHERE id = $1;`, [taskId]);

        return { message: "Task deleted successfully" };
    }
    // Deleta todas as tarefas de um usuário do banco de dados
    static async deleteAllTasksByUser(userId) {
        await query(`DELETE FROM tasks WHERE user_id = $1;`, [userId]);
        return { message: "Tasks deleted successfully" };
    }

}

module.exports = TaskModel;

