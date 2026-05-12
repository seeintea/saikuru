/**
 * TaskTarget 周期目标模板模型类型
 */

export type TargetType = "frequency" | "count" | "duration";
export type TargetOperator = "gte" | "lte" | "eq";

export interface TaskTarget {
  id: string;
  taskId: string;
  targetType: TargetType;
  targetValue: number;
  operator: TargetOperator;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskTargetInput = Omit<TaskTarget, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskTargetInput = Partial<
  Omit<TaskTarget, "id" | "taskId" | "createdAt" | "updatedAt">
>;
