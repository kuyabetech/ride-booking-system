import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export async function connectDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('MySQL database connected successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

export function getDB() {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return pool;
}
