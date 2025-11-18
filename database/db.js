const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function query(text, params) {
    return pool.query(text, params);
}

async function getClient() {
    return pool.connect();
}

module.exports = { query, getClient, pool };
