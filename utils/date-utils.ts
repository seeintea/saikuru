import { Platform } from 'react-native';

// 获取当前周的开始和结束日期
// 周一作为一周的第一天
export const getCurrentWeekRange = (): { startDate: Date; endDate: Date } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 是周日，1 是周一
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const start = new Date(now);
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { startDate: start, endDate: end };
};

// 接受起始日期的版本
export const getWeekRange = (startDate: Date): { startDate: Date; endDate: Date } => {
  const end = new Date(startDate);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { startDate, endDate: end };
};

// 获取周几的名称（中文）
export const getDayName = (date: Date): string => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[date.getDay()];
};

// 获取周号（假设一年有 52 周）
export const getWeekNumber = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - start.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + start.getDay() + 1) / 7);
  return weekNumber % 8 || 8; // 循环 8 周
};

// 格式化日期为 YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 格式化日期范围为 MM.DD-MM.DD
export const formatDateRange = (start: Date, end: Date): string => {
  const format = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };
  return `${format(start)}-${format(end)}`;
};

// 计算两个日期之间的天数
export const getDaysDifference = (start: Date, end: Date): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const differenceInTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

// 计算剩余天数
export const getRemainingDays = (endDate: Date): number => {
  const now = new Date();
  const daysLeft = getDaysDifference(now, endDate);
  return Math.max(daysLeft, 0);
};

// 获取今天的日期（只包含日期部分）
export const getToday = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

// 判断是否是今天
export const isToday = (date: Date): boolean => {
  const today = getToday();
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return today.getTime() === target.getTime();
};

// 获取本周的7天日期数组（周一到周日）
export const getWeekDays = (startDate?: Date): Date[] => {
  let start: Date;
  if (startDate) {
    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
  } else {
    const range = getCurrentWeekRange();
    start = range.startDate;
  }
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};
