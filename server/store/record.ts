/**
 * DailyRecord 数据持久层（Store）
 * 所有 daily_records 表的数据库操作封装在这里
 */

import { getDatabase } from "@server/db/connection";
import type { DailyRecord, CreateRecordInput } from "@server/models";

export async function getRecordsByTaskAndDate(
  taskId: string,
  date: string
): Promise<DailyRecord[]> {
  const db = await getDatabase();
  return db.getAllAsync<DailyRecord>(
    `SELECT
      id,
      task_id AS taskId,
      date,
      count,
      duration,
      notes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM daily_records
    WHERE task_id = ? AND date = ?
    ORDER BY created_at DESC`,
    taskId,
    date
  );
}

export async function getRecordsByDateRange(
  taskId: string,
  startDate: string,
  endDate: string
): Promise<DailyRecord[]> {
  const db = await getDatabase();
  return db.getAllAsync<DailyRecord>(
    `SELECT
      id,
      task_id AS taskId,
      date,
      count,
      duration,
      notes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM daily_records
    WHERE task_id = ? AND date BETWEEN ? AND ?
    ORDER BY date DESC`,
    taskId,
    startDate,
    endDate
  );
}

export async function createRecord(input: CreateRecordInput): Promise<DailyRecord> {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO daily_records
      (id, task_id, date, count, duration, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.taskId,
    input.date,
    input.count,
    input.duration,
    input.notes ?? null,
    now,
    now
  );

  return {
    id,
    taskId: input.taskId,
    date: input.date,
    count: input.count,
    duration: input.duration,
    notes: input.notes ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateRecord(
  id: string,
  input: Partial<Pick<DailyRecord, "count" | "duration" | "notes">>
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.count !== undefined) {
    fields.push("count = ?");
    values.push(input.count);
  }
  if (input.duration !== undefined) {
    fields.push("duration = ?");
    values.push(input.duration);
  }
  if (input.notes !== undefined) {
    fields.push("notes = ?");
    values.push(input.notes);
  }

  if (fields.length === 0) return;

  fields.push("updated_at = ?");
  values.push(now);
  values.push(id);

  await db.runAsync(
    `UPDATE daily_records SET ${fields.join(", ")} WHERE id = ?`,
    ...values
  );
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM daily_records WHERE id = ?", id);
}
