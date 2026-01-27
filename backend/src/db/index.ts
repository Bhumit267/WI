import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Ensure db file location is correct relative to execution
const dbPath = path.resolve(__dirname, '../../openfare.db');

const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

export default db;
export { schema };
