const { query } = require("../database/db");

class TaskModel  {
    constructor(taskRow){
        this.id = taskRow.id;
        this.title = taskRow.title;
        this.userId = taskRow.user_id;
    }
    // Listar todas as listas
    static async findAllTasks() {
        const result = await query("SELECT * FROM tasks");
        return result.rows.map((row) => new TaskModel(row));
    }

    static async findTaskById(id) {
        const result = await query("SELECT * FROM tasks WHERE id = $1", [id]);
        if (!result.rows[0]) return null;
        return new TaskModel(result.rows[0]);
    }

    static async findTasksByUserId(userId) {
        const result = await query("SELECT * FROM tasks WHERE user_id = $1", [userId]
        );
        return result.rows.map((row) => new TaskModel(row));
    }
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

    static async delete(taskId) {
        await query(`DELETE FROM tasks WHERE id = $1;`, [taskId]);

        return { message: "Task deleted successfully" };
    }
    static async deleteAllTasksByUser(userId) {
        await query(`DELETE FROM tasks WHERE user_id = $1;`, [userId]);
        return { message: "Tasks deleted successfully" };
    }

}

module.exports = TaskModel;

