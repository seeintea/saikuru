import * as SQLite from 'expo-sqlite';

// 数据库名称
const DB_NAME = 'saikuru.db';

// 数据库实例
let db: SQLite.SQLiteDatabase | null = null;

/**
 * 获取数据库实例
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return db;
};

/**
 * 初始化数据库表结构
 */
export const initDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  // 创建 daily_tasks 表
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending',
      duration INTEGER,
      notes TEXT,
      workout_type TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 创建 weekly_goals 表
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS weekly_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_number INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      goal_duration INTEGER DEFAULT 150,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(week_number)
    );
  `);

  // 创建索引
  await database.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(date);
  `);
};

/**
 * 关闭数据库连接
 */
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    // expo-sqlite v11 没有 close 方法，让它自动管理
    db = null;
  }
};

/**
 * 删除数据库（仅用于开发测试）
 */
export const deleteDatabase = async (): Promise<void> => {
  try {
    await closeDatabase();
    await SQLite.deleteDatabaseAsync(DB_NAME);
  } catch (error) {
    console.error('Error deleting database:', error);
  }
};
