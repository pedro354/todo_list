require('dotenv-flow').config();
const { Pool } = require("pg");

// Configuração geral
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
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
