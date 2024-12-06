const { Pool } = require('pg');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('../config.json'));

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_DATABASE,
  password: config.DB_PASSWORD,
  port: config.DB_PORT
});

pool.on('connect', () => {
  console.log('Connected to the database successfully!');
});

module.exports = pool;