/**
 * Database schema types
 * Defines the structure of database tables
 */

// Tasks table
export interface TaskRecord {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  cycleType: "days" | "weeks" | "months";
  cycleLength: number;
  countTarget: number | null;
  timeTarget: number | null;
  targetLogic: "and" | "or";
  createdAt: string; // ISO 8601
  isActive: number; // 0 or 1 (SQLite boolean)
}

// Milestones table
export interface MilestoneRecord {
  id: string;
  taskId: string;
  name: string;
  target: number;
  type: "count" | "time";
  description: string | null;
  orderIndex: number;
}

// Daily Records table
export interface DailyRecordRecord {
  id: string;
  taskId: string;
  date: string; // ISO 8601 date only (YYYY-MM-DD)
  count: number;
  duration: number; // in minutes
  notes: string | null;
  workoutType: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// Task Cycles table
export interface TaskCycleRecord {
  id: string;
  taskId: string;
  cycleNumber: number;
  startDate: string; // ISO 8601 date
  endDate: string; // ISO 8601 date
  isCompleted: number; // 0 or 1
  completedAt: string | null; // ISO 8601
}

// Completed Milestones junction table
export interface CompletedMilestoneRecord {
  id: string;
  taskId: string;
  milestoneId: string;
  completedAt: string; // ISO 8601
}
