const { query, getClient } = require("../database/db");
const bcrypt = require('bcrypt');
class UserModel {
    // Mapeia os dados da linha do banco para o objeto da classe
    constructor(userRow) {
        this.id = userRow.id;
        this.username = userRow.username;
        this.email = userRow.email;
        this.password = userRow.password;
    }
    // Retorna todos os usuários do banco
    static async findAll() {
        const result = await query('SELECT * FROM users');
        return result.rows.map((row) => new UserModel(row));
    }
    // Retorna um usuário do banco pelo id
    static async findById(id) {
        const result = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (!result.rows[0]) return null;
        return new UserModel(result.rows[0]);
    }
    // Retorna um usuário do banco pelo email
    static async findUserByEmail(email) {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (!result.rows[0]) return null;
        return new UserModel(result.rows[0]);
    }
    // Cria um novo usuário no banco
    static async createUser(attributes) {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            const hashedPassword = await bcrypt.hash(attributes.password, 10);
            const usersExists = await client.query('SELECT * FROM users WHERE email = $1', [attributes.email]);
            if (usersExists.rows[0]) throw new Error('Email já cadastrado');
            const result = await client.query(
                `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
                [attributes.username, attributes.email, hashedPassword]);
            await client.query('COMMIT');
            return new UserModel(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async createGuestUser(){
        const client = await getClient();
        try {
            await client.query('BEGIN');

            // Verifica se o usuário já existe
            const exists = await query(`SELECT * FROM users WHERE email = 'guest@guest.com'`);
            if(exists.rows.length > 0) return new UserModel(exists.rows[0]);

            const hashed = await bcrypt.hash('senhafake', 10);
            const result = await query(
                `INSERT INTO users (username, email, password)
                VALUES ('Convidado', 'guest@guest.com', $1) 
                RETURNING *;`,
                [hashed]
            );
            await client.query('COMMIT');
            return new UserModel(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    // Atualiza um usuário no banco

    static async updateUser(userId, newAttributes) {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            const result = await query(`SELECT * FROM users WHERE id = $1;`, [userId]);
            if (!result.rows[0]) return null;

            const user = new UserModel(result.rows[0]);

            const { username, email, password } = newAttributes;
            user.username = username;
            user.email = email;
            user.password = password;

            await query(
                `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4;`,
                [user.username, user.email, user.password, user.id]
            );

            await client.query('COMMIT');
            return user;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    // Deleta um usuário do banco

    static async deleteUser(userId) {
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (!result.rows[0]) return null;
        return result.rowCount > 0;
    }
}

module.exports = UserModel;