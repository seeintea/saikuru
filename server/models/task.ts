/**
 * Task 模型类型
 */

export type CycleType = "days" | "weeks" | "months";
export type TargetLogic = "and" | "or";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  cycleType: CycleType;
  cycleLength: number;
  cycleStartDate: string;
  isInfinite: boolean;
  taskEndDate: string | null;
  targetLogic: TargetLogic;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;
