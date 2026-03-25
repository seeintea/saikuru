// 任务完成状态类型
export type TaskCompletionStatus = "completed" | "partial" | "missed" | "pending";

// 每日任务数据接口
export interface DailyTaskData {
  date: Date;
  status: TaskCompletionStatus;
  duration?: number; // 锻炼时长（分钟）
  notes?: string; // 备注
  workoutType?: string; // 锻炼类型
}

// 每周任务数据接口
export interface WeeklyTaskData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  goal: number; // 每周目标时长（分钟）
  days: DailyTaskData[];
  totalCompleted: number; // 本周已完成总时长
  completionRate: number; // 完成百分比
}

// 周期数据结构
export interface TaskCycleData {
  totalWeeks: 8;
  currentWeek: number;
  weeks: WeeklyTaskData[];
  overallCompletionRate: number;
  streak: number; // 连续打卡天数
}

// 记录锻炼输入数据类型
export interface LogWorkoutInput {
  duration: number;
  notes?: string;
  workoutType?: string;
}

// 周目标配置
export interface WeekGoalConfig {
  goal: number; // 每周目标时长（分钟）
  weekNumber: number;
}
