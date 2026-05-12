/**
 * TaskGoal 整体任务目标模型类型
 */

export type GoalType = "streak" | "total_count" | "total_duration";
export type GoalStatus = "active" | "achieved" | "failed" | "abandoned";

export interface TaskGoal {
  id: string;
  taskId: string;
  goalType: GoalType;
  targetValue: number;
  currentValue: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskGoalInput = Omit<
  TaskGoal,
  "id" | "currentValue" | "status" | "createdAt" | "updatedAt"
>;
export type UpdateTaskGoalInput = Partial<
  Omit<TaskGoal, "id" | "taskId" | "createdAt" | "updatedAt">
>;
