require('dotenv').config();
const { Pool } = require('pg');

let connectionString = process.env.DATABASE_URL;

if(!connectionString){
    if(process.env.NODE_ENV === 'production'){
    connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@postgres.railway.internal:${process.env.PGPORT}/${process.env.PGDATABASE}`;
  } else {
    // Quando estiver local, usa a pública
    connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
    }
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})

async function query(queryString, params, callback) {
    return pool.query(queryString, params, callback);
    
}

async function getClient() {
    return pool.connect(); // retorna uma promise 
}

module.exports = {query, getClient}