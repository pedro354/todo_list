const { query, getClient } = require("../database/db");

class UserModel {
    constructor(userRow) {
        this.id = userRow.id;
        this.username = userRow.username;
        this.email = userRow.email;
        this.password = userRow.password;
    }
    static async findAll() {
        const result = await query('SELECT * FROM users');
        return result.rows.map((row) => new UserModel(row));
    }
    static async findById(id) {
        const result = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (!result.rows[0]) return null;
        return new UserModel(result.rows[0]);
    }
    static async findUserByEmail(email) {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (!result.rows[0]) return null;
        return new UserModel(result.rows[0]);
    }
    static async createUser(attributes) {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            const usersExists = await query('SELECT * FROM users WHERE email = $1', [attributes.email]);
            if (usersExists.rows[0]) throw new Error('Email já cadastrado');
            const result = await query(
                `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
                [attributes.username, attributes.email, attributes.password]);
            await client.query('COMMIT');
            return new UserModel(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
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
    static async deleteUser(userId) {
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (!result.rows[0]) return null;
        return result.rowCount > 0;
    }
}

module.exports = UserModel;