require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback);
    
}

async function getClient() {
    return pool.connect(); // retorna uma promise 
}

module.exports = {query, getClient}