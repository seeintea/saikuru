export interface DailyRecord {
  date: string;
  count: number;
  duration: number;
}

export interface Milestone {
  id: string;
  name: string;
  target: number;
  type: "count" | "time";
  description?: string;
}

export interface TaskCycleConfig {
  id: string;
  cycleNumber: number;
  totalCycles: number;
  cycleDays: number;
  countTarget: number;
  timeTarget: number;
  milestones: Milestone[];
}

export interface TaskCycleProgress {
  currentDay: number;
  countCurrent: number;
  timeCurrent: number;
  dailyRecords: DailyRecord[];
  completedMilestones: string[];
}
