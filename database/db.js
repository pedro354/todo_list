require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: false
})

async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback);
    
}

async function getClient() {
    return pool.connect(); // retorna uma promise 
}

module.exports = {query, getClient}