/**
 * DailyRecord 模型类型
 */

export interface DailyRecord {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  count: number;
  duration: number; // 分钟
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateRecordInput = Omit<DailyRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateRecordInput = Partial<
  Omit<DailyRecord, "id" | "taskId" | "date" | "createdAt" | "updatedAt">
>;
