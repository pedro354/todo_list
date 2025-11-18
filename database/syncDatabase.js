const { query } = require("./db");

async function syncDatabase() {
    // USERS
    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `);

    // TASKS
    await query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // ENUM STATUS (IMPORTANTE)
    await query(`
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subtask_status') THEN
                CREATE TYPE subtask_status AS ENUM ('pending', 'completed');
            END IF;
        END $$;
    `);

    // SUBTASKS
    await query(`
        CREATE TABLE IF NOT EXISTS subtasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            status subtask_status NOT NULL DEFAULT 'pending'
        );
    `);

    // RELAÇÃO TASK <-> SUBTASK
    await query(`
        CREATE TABLE IF NOT EXISTS task_subtasks (
            task_id INT NOT NULL,
            subtask_id INT NOT NULL,
            PRIMARY KEY (task_id, subtask_id),
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (subtask_id) REFERENCES subtasks(id) ON DELETE CASCADE
        );
    `);

    console.log('Created "users", "tasks", "subtasks" and relation tables ✔️');
    process.exit(0);
}

syncDatabase();
