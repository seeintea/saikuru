import type { Milestone } from "./task-cycle";

// 任务配置
export interface TaskConfig {
  cycleType: "days" | "weeks" | "months";
  cycleLength: number;
  countTarget?: number;
  timeTarget?: number;
  targetLogic: "and" | "or";
  milestones: Milestone[];
}

// 任务
export interface Task {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  config: TaskConfig;
  createdAt: string;
  isActive: boolean;
}

// 表单输入类型
export interface TaskFormInput {
  name: string;
  description: string;
  cycleType: "days" | "weeks" | "months";
  cycleLength: number;
  countTarget: string;
  timeTarget: string;
  targetLogic: "and" | "or";
  milestones: Milestone[];
}

// 默认值
export const DEFAULT_TASK_FORM_INPUT: TaskFormInput = {
  name: "",
  description: "",
  cycleType: "weeks",
  cycleLength: 1,
  countTarget: "",
  timeTarget: "",
  targetLogic: "and",
  milestones: [],
};
