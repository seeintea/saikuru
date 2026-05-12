/**
 * 周期计算工具函数
 * 所有周期边界通过配置计算得出，不存储周期实体
 */

import type { Task } from "@server/models";

export type CycleType = "days" | "weeks" | "months";

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month: month - 1, day };
}

function formatDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function toDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

function addDays(dateStr: string, days: number): string {
  const d = toDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function safeAddMonths(dateStr: string, months: number): string {
  const { year, month, day } = parseDate(dateStr);
  const targetMonth = month + months;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDayOfMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  const targetDay = Math.min(day, lastDayOfMonth);
  return formatDate(targetYear, normalizedMonth, targetDay);
}

/**
 * 计算指定日期属于第几个周期（从 1 开始）
 */
export function getCycleNumber(
  startDate: string,
  cycleType: CycleType,
  cycleLength: number,
  date: string
): number {
  const dateObj = toDate(date);
  const startObj = toDate(startDate);

  if (dateObj < startObj) return 0;

  switch (cycleType) {
    case "days": {
      const daysDiff = Math.floor((dateObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24));
      return Math.floor(daysDiff / cycleLength) + 1;
    }
    case "weeks": {
      const daysDiff = Math.floor((dateObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24));
      return Math.floor(daysDiff / (cycleLength * 7)) + 1;
    }
    case "months": {
      const { year: sy, month: sm } = parseDate(startDate);
      const { year: dy, month: dm } = parseDate(date);
      let monthDiff = (dy - sy) * 12 + (dm - sm);
      let cycleNum = Math.max(1, Math.floor(monthDiff / cycleLength) + 1);

      while (toDate(safeAddMonths(startDate, (cycleNum - 1) * cycleLength)) > dateObj) {
        cycleNum--;
      }
      while (toDate(safeAddMonths(startDate, cycleNum * cycleLength)) <= dateObj) {
        cycleNum++;
      }

      return cycleNum;
    }
  }
}

/**
 * 计算第 N 个周期的起止日期（左闭右开）
 */
export function getCycleDateRange(
  startDate: string,
  cycleType: CycleType,
  cycleLength: number,
  cycleNumber: number
): [start: string, end: string] {
  const n = cycleNumber - 1;

  switch (cycleType) {
    case "days":
      return [
        addDays(startDate, n * cycleLength),
        addDays(startDate, (n + 1) * cycleLength),
      ];
    case "weeks":
      return [
        addDays(startDate, n * cycleLength * 7),
        addDays(startDate, (n + 1) * cycleLength * 7),
      ];
    case "months":
      return [
        safeAddMonths(startDate, n * cycleLength),
        safeAddMonths(startDate, (n + 1) * cycleLength),
      ];
  }
}

/**
 * 获取当前周期编号
 */
export function getCurrentCycleNumber(task: Task): number {
  const today = new Date().toISOString().slice(0, 10);
  return getCycleNumber(task.cycleStartDate, task.cycleType, task.cycleLength, today);
}

/**
 * 判断日期是否在任务有效期内
 */
export function isDateInTaskRange(task: Task, date: string): boolean {
  const d = toDate(date);
  if (d < toDate(task.cycleStartDate)) return false;
  if (!task.isInfinite && task.taskEndDate && d >= toDate(task.taskEndDate)) return false;
  return true;
}
