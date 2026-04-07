/**
 * Database initialization and base utilities
 */

import * as SQLite from "expo-sqlite";

const DB_NAME = "saikuru.db";

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or create the database instance
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
}

/**
 * Initialize database tables
 */
export async function initDatabase(): Promise<void> {
  const db = await getDatabase();

  // Create a simple example table - you can modify this later
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}

/**
 * Reset database (for development)
 */
export async function resetDatabase(): Promise<void> {
  await closeDatabase();
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
    DROP TABLE IF EXISTS tasks;
  `);
  await db.closeAsync();
  dbInstance = null;
  await initDatabase();
}
