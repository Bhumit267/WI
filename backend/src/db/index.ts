import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Use DATABASE_PATH env var for production (e.g., /data/openfare.db on Render)
// Fallback to local path for development
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../openfare.db');

console.log(`[DB] Using database at: ${dbPath}`);

const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

export default db;
export { schema };
