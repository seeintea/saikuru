/**
 * TaskGoal 数据持久层（Store）
 */

import { getDatabase } from "@server/db/connection";
import type { TaskGoal, CreateTaskGoalInput, UpdateTaskGoalInput, GoalStatus } from "@server/models";

export async function getGoalsByTask(taskId: string): Promise<TaskGoal[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<TaskGoal>(
    `SELECT
      id,
      task_id AS taskId,
      goal_type AS goalType,
      target_value AS targetValue,
      current_value AS currentValue,
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM task_goals
    WHERE task_id = ?
    ORDER BY created_at ASC`,
    taskId
  );
  return rows.map((r) => ({
    ...r,
    currentValue: Number(r.currentValue),
  }));
}

export async function createGoal(input: CreateTaskGoalInput): Promise<TaskGoal> {
  const db = await getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO task_goals
      (id, task_id, goal_type, target_value, current_value, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.taskId,
    input.goalType,
    input.targetValue,
    0,
    "active",
    now,
    now
  );

  const goal = await db.getFirstAsync<TaskGoal>(
    `SELECT
      id,
      task_id AS taskId,
      goal_type AS goalType,
      target_value AS targetValue,
      current_value AS currentValue,
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM task_goals
    WHERE id = ?`,
    id
  );
  if (!goal) throw new Error("Failed to create task goal");
  return { ...goal, currentValue: Number(goal.currentValue) };
}

export async function updateGoal(id: string, input: UpdateTaskGoalInput): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (input.goalType !== undefined) {
    fields.push("goal_type = ?");
    values.push(input.goalType);
  }
  if (input.targetValue !== undefined) {
    fields.push("target_value = ?");
    values.push(input.targetValue);
  }
  if (input.currentValue !== undefined) {
    fields.push("current_value = ?");
    values.push(input.currentValue);
  }
  if (input.status !== undefined) {
    fields.push("status = ?");
    values.push(input.status);
  }

  if (fields.length === 0) return;

  fields.push("updated_at = ?");
  values.push(now);
  values.push(id);

  await db.runAsync(`UPDATE task_goals SET ${fields.join(", ")} WHERE id = ?`, ...values);
}

export async function deleteGoal(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM task_goals WHERE id = ?", id);
}

/**
 * 重新计算整体目标进度
 * 从 daily_records 聚合数据并更新 current_value 和 status
 */
export async function recomputeGoalProgress(taskId: string): Promise<void> {
  const db = await getDatabase();

  const goals = await db.getAllAsync<{
    id: string;
    goalType: string;
    targetValue: number;
  }>(
    `SELECT id, goal_type AS goalType, target_value AS targetValue FROM task_goals WHERE task_id = ?`,
    taskId
  );

  if (goals.length === 0) return;

  // 聚合数据
  const aggregate = await db.getFirstAsync<{
    totalCount: number;
    totalDuration: number;
    totalDays: number;
  }>(
    `SELECT
      COALESCE(SUM(count), 0) AS totalCount,
      COALESCE(SUM(duration), 0) AS totalDuration,
      COUNT(DISTINCT date) AS totalDays
    FROM daily_records
    WHERE task_id = ?`,
    taskId
  );

  const totals = {
    totalCount: aggregate?.totalCount ?? 0,
    totalDuration: aggregate?.totalDuration ?? 0,
    totalDays: aggregate?.totalDays ?? 0,
  };

  // 计算 streak
  let streak = 0;
  if (totals.totalDays > 0) {
    const records = await db.getAllAsync<{ date: string }>(
      `SELECT date FROM daily_records WHERE task_id = ? AND (count > 0 OR duration > 0) ORDER BY date DESC`,
      taskId
    );

    if (records.length > 0) {
      const dates = records.map((r) => r.date);
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      // 从最近一天开始向前计算连续天数
      if (dates[0] === today || dates[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1] + "T00:00:00");
          const curr = new Date(dates[i] + "T00:00:00");
          const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
  }

  const now = new Date().toISOString();

  for (const goal of goals) {
    let currentValue = 0;
    let status: GoalStatus = "active";

    switch (goal.goalType) {
      case "total_count":
        currentValue = totals.totalCount;
        break;
      case "total_duration":
        currentValue = totals.totalDuration;
        break;
      case "streak":
        currentValue = streak;
        break;
    }

    if (currentValue >= goal.targetValue) {
      status = "achieved";
    }

    await db.runAsync(
      `UPDATE task_goals SET current_value = ?, status = ?, updated_at = ? WHERE id = ?`,
      currentValue,
      status,
      now,
      goal.id
    );
  }
}
