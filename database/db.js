require('dotenv').config();
const { Pool } = require('pg');

function createConnectionString() {
    if(process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    return `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
}

const pool = new Pool({
    connectionString: createConnectionString(),
    ssl: {
        rejectUnauthorized: false
    },  
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
})

async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback);
    
}

async function getClient() {
    return pool.connect(); // retorna uma promise 
}
async function testConnection() {
    try {
        const result = await query('SELECT NOW()');
        console.log('✅ Database connection test successful:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ Database connection test failed:', error);
        return false;
    }
}
module.exports = {query, getClient, testConnection}