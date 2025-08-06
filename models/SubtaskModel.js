const { query, getClient } = require("../database/db");

class SubtaskModel {
    constructor(subtaskRow){
        this.id = subtaskRow.id;
        this.title = subtaskRow.title;
        this.status = subtaskRow.status;
        this.task_id = subtaskRow.taskId;
        this.subtask_id = subtaskRow.subtaskId;
    }

    static async findSubtasksById(id) {
    const result = await query(
        `SELECT * FROM subtasks WHERE id = $1`, [id])
        return result.rows.map(row => new SubtaskModel(row));
    }
    static async findSubtasksByTaskId(taskId) {
    const result = await query(
        `SELECT subtasks.* FROM subtasks
         JOIN task_subtasks ON subtasks.id = task_subtasks.subtask_id
         WHERE task_subtasks.task_id = $1`,
        [taskId]
    );
    return result.rows.map(row => new SubtaskModel(row));
}
    static async createSubtask({title, taskId, status}) {
        const client = await getClient();

        try {
        await client.query(`BEGIN`);

        const result = await query(
            `INSERT INTO subtasks(title, status)
            VALUES ($1, $2)
            RETURNING *`,
            [title,status]
        );

        const subtaskId = result.rows[0];

        await query(
            `INSERT INTO task_subtasks (task_id, subtask_id) VALUES ($1, $2)`,
            [taskId, subtaskId.id]
        );
        await client.query(`COMMIT`);
        return subtaskId;
        } catch (error) {
            await client.query(`ROLLBACK`);
            throw error;
        } finally {
            client.release();
        }
    }
    static async update(id, attributes ){
        const client = await getClient();
        try {
            await client.query(`BEGIN`);

        const {rows} = await query(`SELECT * FROM subtasks WHERE id = $1;`, [id]);
        if(!rows[0]) return null;

        const subtask = new SubtaskModel(rows[0]);
        Object.assign(subtask, attributes);

        const { rows: updateRows } = await query(
            // title não atualiza, então ele vai retornar null na api
            `UPDATE subtasks SET
            title = $1, 
            status = $2
            WHERE id = $3
            RETURNING *`,
            [
                subtask.title,
                subtask.status,
                subtask.id
            ] 
        );

        await client.query(`COMMIT`);
        return new SubtaskModel(updateRows[0]);
    } catch (error) {
        await client.query(`ROLLBACK`);
        throw error;
    } finally {
        client.release();
    }
    }
    static async delete(subtaskId) {
        const client = await getClient();
        try {
        await client.query(`BEGIN`);

        const { rows } = await query(`
            SELECT * FROM subtasks WHERE id = $1
        `, [subtaskId]);

        if (!rows[0]) return null;

        // Primeiro remove da tabela intermediária
        await query(`DELETE FROM task_subtasks WHERE subtask_id = $1`, [subtaskId]);
        // Depois remove da subtasks
        await query(`DELETE FROM subtasks WHERE id = $1`, [subtaskId]);
        await client.query(`COMMIT`);
        return rows[0];
        } catch (error) {
            await client.query(`ROLLBACK`);
            throw error;
        } finally {
            client.release();
        }
    }
    static async deleteAllbyTaskId(taskId) {
        const client = await getClient();
        try {
            await client.query(`BEGIN`);
        await query(`DELETE FROM task_subtasks WHERE task_id = $1`, [taskId]);

        await query(`
                DELETE FROM subtasks
                WHERE id NOT IN (
                SELECT subtask_id FROM task_subtasks
                )
            `);
        await client.query(`COMMIT`);
        return rows[0];
        } catch (error) {
            await client.query(`ROLLBACK`);
            throw error;
        } finally {
            client.release();
        }
    }
}
module.exports = SubtaskModel;

