const { query } = require("./db");

async function syncDatabase() {
  try {
    // Criação das tabelas
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Cria o tipo ENUM se não existir
    await query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subtask_status') THEN
          CREATE TYPE subtask_status AS ENUM ('pending', 'in_progress', 'completed');
        END IF;
      END
      $$;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status subtask_status NOT NULL DEFAULT 'pending'
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS task_subtasks (
        task_id INT NOT NULL,
        subtask_id INT NOT NULL,
        PRIMARY KEY (task_id, subtask_id),
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (subtask_id) REFERENCES subtasks(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Tabelas criadas com sucesso: "users", "tasks", "subtasks" e "task_subtasks"');
  } catch (error) {
    console.error('❌ Erro ao sincronizar o banco:', error);
  } finally {
    process.exit(0);
  }
}

syncDatabase();
