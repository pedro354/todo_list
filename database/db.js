const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Query padrão
async function query(text, params) {
  return pool.query(text, params);
}

// Cliente manual (transações)
async function getClient() {
  return pool.connect();
}

module.exports = { query, getClient };
