/**
 * DailyRecord 数据持久层（Store）
 */

import { getDatabase } from "@server/db/connection";
import type { DailyRecord, CreateRecordInput, UpdateRecordInput } from "@server/models";
import { recomputeGoalProgress } from "./task-goal";

export interface RecordListItem extends DailyRecord {
  taskName: string;
  taskIcon: string | null;
  taskColor: string | null;
}

export async function getAllRecords(limit = 100, offset = 0): Promise<RecordListItem[]> {
  const db = await getDatabase();
  return db.getAllAsync<RecordListItem>(
    `SELECT
      r.id,
      r.task_id AS taskId,
      r.date,
      r.count,
      r.duration,
      r.notes,
      r.created_at AS createdAt,
      r.updated_at AS updatedAt,
      t.name AS taskName,
      t.icon AS taskIcon,
      t.color AS taskColor
    FROM daily_records r
    JOIN tasks t ON t.id = r.task_id
    ORDER BY r.date DESC, r.created_at DESC
    LIMIT ? OFFSET ?`,
    limit,
    offset
  );
}

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

export async function getRecordsByTaskAndDateRange(
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
    WHERE task_id = ? AND date >= ? AND date < ?
    ORDER BY date ASC`,
    taskId,
    startDate,
    endDate
  );
}

export async function getRecordsByTask(
  taskId: string,
  limit?: number,
  offset?: number
): Promise<DailyRecord[]> {
  const db = await getDatabase();
  let sql = `SELECT
      id,
      task_id AS taskId,
      date,
      count,
      duration,
      notes,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM daily_records
    WHERE task_id = ?
    ORDER BY date DESC`;
  const params: (string | number)[] = [taskId];

  if (limit !== undefined) {
    sql += " LIMIT ?";
    params.push(limit);
  }
  if (offset !== undefined) {
    sql += " OFFSET ?";
    params.push(offset);
  }

  return db.getAllAsync<DailyRecord>(sql, ...params);
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

  await recomputeGoalProgress(input.taskId);

  const record = await db.getFirstAsync<DailyRecord>(
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
    WHERE id = ?`,
    id
  );
  if (!record) throw new Error("Failed to create daily record");
  return record;
}

export async function updateRecord(id: string, input: UpdateRecordInput): Promise<void> {
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

  const taskId = await db.getFirstAsync<{ taskId: string }>(
    `SELECT task_id AS taskId FROM daily_records WHERE id = ?`,
    id
  );

  await db.runAsync(`UPDATE daily_records SET ${fields.join(", ")} WHERE id = ?`, ...values);

  if (taskId) {
    await recomputeGoalProgress(taskId.taskId);
  }
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDatabase();

  const taskId = await db.getFirstAsync<{ taskId: string }>(
    `SELECT task_id AS taskId FROM daily_records WHERE id = ?`,
    id
  );

  await db.runAsync("DELETE FROM daily_records WHERE id = ?", id);

  if (taskId) {
    await recomputeGoalProgress(taskId.taskId);
  }
}
