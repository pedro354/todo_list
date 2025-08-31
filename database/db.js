
require('dotenv-flow').config();
const { Pool } = require('pg');
// conexão com o banco de dados 
const isProduction = process.env.NODE_ENV === 'production';
// Configuração da conexão com o banco de dados
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
})
// função para executar queries no banco de dados
async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback);
    
}
// função para obter um cliente do pool de conexões
async function getClient() {
    return pool.connect(); // retorna uma promise 
}

module.exports = {query, getClient}