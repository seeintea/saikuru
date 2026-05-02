/**
 * Task 模型类型
 */

export interface Task {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  cycleType: "days" | "weeks" | "months";
  cycleLength: number;
  countTarget: number | null;
  timeTarget: number | null;
  targetLogic: "and" | "or";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;
