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
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      cycle_type TEXT NOT NULL,
      cycle_length INTEGER NOT NULL DEFAULT 1,
      cycle_start_date TEXT NOT NULL,
      is_infinite INTEGER NOT NULL DEFAULT 1,
      task_end_date TEXT,
      target_logic TEXT NOT NULL DEFAULT 'and',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_targets (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_value INTEGER NOT NULL,
      operator TEXT NOT NULL DEFAULT 'gte',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_goals (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT NOT NULL,
      goal_type TEXT NOT NULL,
      target_value INTEGER NOT NULL,
      current_value INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS daily_records (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT NOT NULL,
      date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_task_targets_task ON task_targets(task_id);
    CREATE INDEX IF NOT EXISTS idx_task_goals_task ON task_goals(task_id);
    CREATE INDEX IF NOT EXISTS idx_records_task_date ON daily_records(task_id, date);
    CREATE INDEX IF NOT EXISTS idx_records_date ON daily_records(date);
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
    DROP TABLE IF EXISTS task_targets;
    DROP TABLE IF EXISTS task_goals;
    DROP TABLE IF EXISTS daily_records;
    DROP TABLE IF EXISTS tasks;
  `);
  await db.closeAsync();
  dbInstance = null;
  await initDatabase();
}
