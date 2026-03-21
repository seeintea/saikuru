import {
  TaskCycleData,
  WeeklyTaskData,
  DailyTaskData,
  TaskCompletionStatus,
} from '@/features/task-cycle/types';
import { getCurrentWeekRange, getWeekNumber, getWeekDays } from '@/utils/date-utils';
import { DEFAULT_WEEKLY_GOAL } from '@/features/task-cycle/constants';

// 创建每日模拟数据
const createDailyData = (
  date: Date,
  status: TaskCompletionStatus,
  duration?: number
): DailyTaskData => {
  return {
    date,
    status,
    duration,
    notes: status === 'completed' && duration ? `完成了 ${duration} 分钟的锻炼` : '',
    workoutType: duration ? ['跑步', '力量训练', '瑜伽'][Math.floor(Math.random() * 3)] : undefined,
  };
};

// 创建指定周的模拟数据
const createWeekData = (weekNumber: number, baseDate: Date): WeeklyTaskData => {
  // 计算该周的开始和结束日期（周一到周日）
  const start = new Date(baseDate);
  // 计算与当前周的偏移量
  const currentWeek = getWeekNumber(baseDate);
  const weekOffset = weekNumber - currentWeek;
  const daysOffset = weekOffset * 7;

  start.setDate(start.getDate() + daysOffset);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    weekDays.push(date);
  }

  const weekEnd = new Date(start);
  weekEnd.setDate(start.getDate() + 6);

  // 根据周数生成不同的完成状态分布
  const days: DailyTaskData[] = weekDays.map((date, index) => {
    if (weekNumber < currentWeek) {
      // 过去的周
      const completed = Math.random() > 0.3;
      if (completed) {
        return createDailyData(date, 'completed', 20 + Math.floor(Math.random() * 40));
      } else {
        return createDailyData(date, 'missed');
      }
    } else if (weekNumber === currentWeek) {
      // 当前周 - 根据今天是星期几来设置已完成状态
      const today = new Date();
      const todayDay = today.getDay(); // 0 是周日，1 是周一...6 是周六

      // 将今天的 0-6 映射到周一开始的 0-6 索引
      const todayIndex = todayDay === 0 ? 6 : todayDay - 1;

      // 今天之前的天应该是已完成或未完成状态
      if (index < todayIndex) {
        if (index < 2) {
          return createDailyData(date, 'completed', 30 + index * 5);
        } else if (index === 2) {
          return createDailyData(date, 'missed');
        } else {
          return createDailyData(date, 'completed', 25 + index * 3);
        }
      } else if (index === todayIndex) {
        // 今天
        return createDailyData(date, 'pending');
      } else {
        // 未来的天
        return createDailyData(date, 'pending');
      }
    } else {
      // 未来的周
      return createDailyData(date, 'pending');
    }
  });

  const totalCompleted = days
    .filter((day) => day.status === 'completed' && day.duration)
    .reduce((sum, day) => sum + (day.duration || 0), 0);

  const completionRate =
    weekNumber > currentWeek ? 0 : Math.round((totalCompleted / DEFAULT_WEEKLY_GOAL) * 100);

  return {
    weekNumber,
    startDate: weekDays[0],
    endDate: weekDays[6],
    goal: DEFAULT_WEEKLY_GOAL,
    days,
    totalCompleted,
    completionRate,
  };
};

// 创建完整的周期数据（8周）
export const createCycleData = (): TaskCycleData => {
  const currentDate = new Date();
  const currentWeek = getWeekNumber(currentDate);
  const weeks: WeeklyTaskData[] = [];

  // 生成8周的数据（从第1周到第8周）
  for (let weekNum = 1; weekNum <= 8; weekNum++) {
    weeks.push(createWeekData(weekNum, currentDate));
  }

  // 计算整体完成率
  const completedWeeks = weeks.filter((w) => w.weekNumber < currentWeek);
  const overallCompletionRate =
    completedWeeks.length > 0
      ? Math.round(
          completedWeeks.reduce((sum, w) => sum + w.completionRate, 0) / completedWeeks.length
        )
      : 0;

  // 计算连续打卡天数
  const streak = 5; // 模拟连续打卡5天

  return {
    totalWeeks: 8,
    currentWeek,
    weeks,
    overallCompletionRate,
    streak,
  };
};

// 创建当前周模拟数据
export const createCurrentWeekData = (): WeeklyTaskData => {
  return createWeekData(getWeekNumber(new Date()), new Date());
};

// 更新每日数据
export const updateDailyData = (
  weekData: WeeklyTaskData,
  date: Date,
  duration: number
): WeeklyTaskData => {
  const updatedDays = weekData.days.map((day) => {
    if (day.date.toDateString() === date.toDateString()) {
      return {
        ...day,
        status: 'completed' as const,
        duration,
        notes: `完成了 ${duration} 分钟的锻炼`,
        workoutType: ['跑步', '力量训练', '瑜伽'][Math.floor(Math.random() * 3)],
      };
    }
    return day;
  });

  const totalCompleted = updatedDays
    .filter((day) => day.status === 'completed' && day.duration)
    .reduce((sum, day) => sum + (day.duration || 0), 0);

  const completionRate = Math.round((totalCompleted / weekData.goal) * 100);

  return {
    ...weekData,
    days: updatedDays,
    totalCompleted,
    completionRate,
  };
};
