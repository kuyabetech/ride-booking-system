import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB, getDB } from '../config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Connect to database first
    await connectDB();
    
    const db = getDB();
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await db.query(statement);
          console.log('✓ Executed statement');
        } catch (error) {
          // Ignore "already exists" errors for CREATE statements
          if (error.code !== 'ER_DB_CREATE_EXISTS' && error.code !== 'ER_TABLE_EXISTS_ERROR') {
            console.error('Error executing statement:', error.message);
          }
        }
      }
    }
    
    console.log('✓ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDatabase();
