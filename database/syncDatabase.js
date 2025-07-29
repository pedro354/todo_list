const { query } = require("./db");

async function syncDatabase(){
    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `);
    await query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            user_id INT references users(id) ON DELETE CASCADE,
            parent_task_id INT,
            FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE
        );
    `);
    console.log('Created "users" and "tasks" tables');

    await query(`
        INSERT INTO users (username, email, password)
        VALUES ('admin', 'admin@example.com', 'admin')
        ON CONFLICT (username) DO NOTHING;
    `);
    await query(`
        INSERT INTO tasks (title, status, user_id) VALUES
            ('Task 1', 'pending', 1),
            ('Task 2', 'completed', 1),
            ('Task 3', 'pending', 1),
            ('Task 4', 'pending', 1),
            ('Task 5', 'pending', 1)
    `);
        console.log('Created "admin" user and "Task 1", "Task 2", "Task 3" tasks para exemplo' );

    await query(`
        UPDATE tasks SET
        parent_task_id = 1
        WHERE id IN (3, 4);
    `);
    console.log('Updated "Task 3" and "Task 4" to be children of "Task 1"');

        
    process.exit(0);
}

syncDatabase();