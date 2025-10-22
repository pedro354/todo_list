require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function query(queryString, params, callback) {
  return pool.query(queryString, params, callback);
}

async function getClient() {
  return pool.connect();
}

module.exports = { query, getClient };
