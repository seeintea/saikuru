/**
 * 数据库连接管理
 * 初始化、打开、关闭、重置数据库连接
 */

import * as SQLite from "expo-sqlite";

const DB_NAME = "saikuru.db";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
}

export async function initDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      cycle_type TEXT NOT NULL DEFAULT 'days',
      cycle_length INTEGER NOT NULL DEFAULT 1,
      count_target INTEGER,
      time_target INTEGER,
      target_logic TEXT NOT NULL DEFAULT 'and',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_records (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT NOT NULL,
      date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}

export async function resetDatabase(): Promise<void> {
  await closeDatabase();
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS daily_records;
  `);
  await db.closeAsync();
  dbInstance = null;
  await initDatabase();
}
