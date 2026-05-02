/**
 * Task 数据持久层（Store）
 * 所有 Task 表的数据库操作封装在这里
 */

import { getDatabase } from "@server/db/connection";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@server/models";

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Task>(
    `SELECT
      id,
      name,
      description,
      icon,
      cycle_type AS cycleType,
      cycle_length AS cycleLength,
      count_target AS countTarget,
      time_target AS timeTarget,
      target_logic AS targetLogic,
      is_active AS isActive,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM tasks
    WHERE is_active = 1
    ORDER BY created_at DESC`
  );
  return rows.map((r) => ({
    ...r,
    isActive: Boolean(r.isActive),
  }));
}

export async function getTaskById(id: string): Promise<Task | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Task>(
    `SELECT
      id,
      name,
      description,
      icon,
      cycle_type AS cycleType,
      cycle_length AS cycleLength,
      count_target AS countTarget,
      time_target AS timeTarget,
      target_logic AS targetLogic,
      is_active AS isActive,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM tasks
    WHERE id = ?`,
    id
  );
  return row ? { ...row, isActive: Boolean(row.isActive) } : null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO tasks
      (id, name, description, icon, cycle_type, cycle_length,
       count_target, time_target, target_logic, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.name,
    input.description ?? null,
    input.icon ?? null,
    input.cycleType,
    input.cycleLength,
    input.countTarget ?? null,
    input.timeTarget ?? null,
    input.targetLogic,
    input.isActive ? 1 : 0,
    now,
    now
  );

  return {
    id,
    name: input.name,
    description: input.description ?? null,
    icon: input.icon ?? null,
    cycleType: input.cycleType,
    cycleLength: input.cycleLength,
    countTarget: input.countTarget ?? null,
    timeTarget: input.timeTarget ?? null,
    targetLogic: input.targetLogic,
    isActive: input.isActive,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.name !== undefined) {
    fields.push("name = ?");
    values.push(input.name);
  }
  if (input.description !== undefined) {
    fields.push("description = ?");
    values.push(input.description);
  }
  if (input.icon !== undefined) {
    fields.push("icon = ?");
    values.push(input.icon);
  }
  if (input.cycleType !== undefined) {
    fields.push("cycle_type = ?");
    values.push(input.cycleType);
  }
  if (input.cycleLength !== undefined) {
    fields.push("cycle_length = ?");
    values.push(input.cycleLength);
  }
  if (input.countTarget !== undefined) {
    fields.push("count_target = ?");
    values.push(input.countTarget);
  }
  if (input.timeTarget !== undefined) {
    fields.push("time_target = ?");
    values.push(input.timeTarget);
  }
  if (input.targetLogic !== undefined) {
    fields.push("target_logic = ?");
    values.push(input.targetLogic);
  }
  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }

  if (fields.length === 0) return;

  fields.push("updated_at = ?");
  values.push(now);
  values.push(id);

  await db.runAsync(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
    ...values
  );
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
}
