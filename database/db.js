require('dotenv-flow').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Configuração da conexão com o banco de dados

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
})
console.log("DATABASE_URL em:", process.env.DATABASE_URL);
async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback);
    
}

async function getClient() {
    return pool.connect(); // retorna uma promise 
}

module.exports = {query, getClient}