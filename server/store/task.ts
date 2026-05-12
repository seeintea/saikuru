/**
 * Task 数据持久层（Store）
 */

import { getDatabase } from "@server/db/connection";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@server/models";
import type { CreateTaskTargetInput } from "@server/models/task-target";
import type { CreateTaskGoalInput } from "@server/models/task-goal";

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Task>(
    `SELECT
      id,
      name,
      description,
      icon,
      color,
      cycle_type AS cycleType,
      cycle_length AS cycleLength,
      cycle_start_date AS cycleStartDate,
      is_infinite AS isInfinite,
      task_end_date AS taskEndDate,
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
    isInfinite: Boolean(r.isInfinite),
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
      color,
      cycle_type AS cycleType,
      cycle_length AS cycleLength,
      cycle_start_date AS cycleStartDate,
      is_infinite AS isInfinite,
      task_end_date AS taskEndDate,
      target_logic AS targetLogic,
      is_active AS isActive,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM tasks
    WHERE id = ?`,
    id
  );
  return row
    ? {
        ...row,
        isInfinite: Boolean(row.isInfinite),
        isActive: Boolean(row.isActive),
      }
    : null;
}

export async function createTask(
  input: CreateTaskInput,
  targets?: CreateTaskTargetInput[],
  goals?: CreateTaskGoalInput[]
): Promise<Task> {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO tasks
        (id, name, description, icon, color, cycle_type, cycle_length,
         cycle_start_date, is_infinite, task_end_date, target_logic, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.name,
      input.description ?? null,
      input.icon ?? null,
      input.color ?? null,
      input.cycleType,
      input.cycleLength,
      input.cycleStartDate,
      input.isInfinite ? 1 : 0,
      input.taskEndDate ?? null,
      input.targetLogic,
      input.isActive ? 1 : 0,
      now,
      now
    );

    if (targets?.length) {
      for (const t of targets) {
        await db.runAsync(
          `INSERT INTO task_targets
            (id, task_id, target_type, target_value, operator, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          crypto.randomUUID(),
          id,
          t.targetType,
          t.targetValue,
          t.operator,
          now,
          now
        );
      }
    }

    if (goals?.length) {
      for (const g of goals) {
        await db.runAsync(
          `INSERT INTO task_goals
            (id, task_id, goal_type, target_value, current_value, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          crypto.randomUUID(),
          id,
          g.goalType,
          g.targetValue,
          0,
          "active",
          now,
          now
        );
      }
    }
  });

  const task = await getTaskById(id);
  if (!task) throw new Error("Failed to create task");
  return task;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<void> {
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
  if (input.color !== undefined) {
    fields.push("color = ?");
    values.push(input.color);
  }
  if (input.cycleType !== undefined) {
    fields.push("cycle_type = ?");
    values.push(input.cycleType);
  }
  if (input.cycleLength !== undefined) {
    fields.push("cycle_length = ?");
    values.push(input.cycleLength);
  }
  if (input.cycleStartDate !== undefined) {
    fields.push("cycle_start_date = ?");
    values.push(input.cycleStartDate);
  }
  if (input.isInfinite !== undefined) {
    fields.push("is_infinite = ?");
    values.push(input.isInfinite ? 1 : 0);
  }
  if (input.taskEndDate !== undefined) {
    fields.push("task_end_date = ?");
    values.push(input.taskEndDate);
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

  await db.runAsync(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, ...values);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
}
