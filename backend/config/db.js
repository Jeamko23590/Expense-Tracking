const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Database Connection Pool
 * Uses environment variables for configuration
 * SSL enabled for cloud database providers (TiDB, PlanetScale, etc.)
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 4000,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to database:', err.message);
  });

module.exports = pool;
