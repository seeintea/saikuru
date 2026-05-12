/**
 * TaskTarget 数据持久层（Store）
 */

import { getDatabase } from "@server/db/connection";
import type { TaskTarget, CreateTaskTargetInput, UpdateTaskTargetInput } from "@server/models";

export async function getTargetsByTask(taskId: string): Promise<TaskTarget[]> {
  const db = await getDatabase();
  return db.getAllAsync<TaskTarget>(
    `SELECT
      id,
      task_id AS taskId,
      target_type AS targetType,
      target_value AS targetValue,
      operator,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM task_targets
    WHERE task_id = ?
    ORDER BY created_at ASC`,
    taskId
  );
}

export async function createTarget(input: CreateTaskTargetInput): Promise<TaskTarget> {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO task_targets
      (id, task_id, target_type, target_value, operator, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.taskId,
    input.targetType,
    input.targetValue,
    input.operator,
    now,
    now
  );

  const target = await db.getFirstAsync<TaskTarget>(
    `SELECT
      id,
      task_id AS taskId,
      target_type AS targetType,
      target_value AS targetValue,
      operator,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM task_targets
    WHERE id = ?`,
    id
  );
  if (!target) throw new Error("Failed to create task target");
  return target;
}

export async function updateTarget(id: string, input: UpdateTaskTargetInput): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (input.targetType !== undefined) {
    fields.push("target_type = ?");
    values.push(input.targetType);
  }
  if (input.targetValue !== undefined) {
    fields.push("target_value = ?");
    values.push(input.targetValue);
  }
  if (input.operator !== undefined) {
    fields.push("operator = ?");
    values.push(input.operator);
  }

  if (fields.length === 0) return;

  fields.push("updated_at = ?");
  values.push(now);
  values.push(id);

  await db.runAsync(`UPDATE task_targets SET ${fields.join(", ")} WHERE id = ?`, ...values);
}

export async function deleteTarget(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM task_targets WHERE id = ?", id);
}

export async function batchReplaceTargets(
  taskId: string,
  targets: Omit<CreateTaskTargetInput, "taskId">[]
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM task_targets WHERE task_id = ?", taskId);

    for (const t of targets) {
      await db.runAsync(
        `INSERT INTO task_targets
          (id, task_id, target_type, target_value, operator, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        crypto.randomUUID(),
        taskId,
        t.targetType,
        t.targetValue,
        t.operator,
        now,
        now
      );
    }
  });
}
