import { TaskCompletionStatus, DailyTaskData, WeeklyTaskData, TaskCycleData } from '@/features/task-cycle/types';
import { getDatabase } from './index';
import { getWeekNumber, getCurrentWeekRange, getWeekDays, getWeekRange } from '@/utils/date-utils';
import { createCycleData } from '@/features/task-cycle/utils/mock-data';

// 默认每周目标
const DEFAULT_WEEKLY_GOAL = 150;

// 转换数据库记录到 DailyTaskData
const dbRecordToDailyTask = (record: any): DailyTaskData => ({
  date: new Date(record.date),
  status: record.status as TaskCompletionStatus,
  duration: record.duration,
  notes: record.notes,
  workoutType: record.workout_type,
});

// 转换 DailyTaskData 到数据库记录
const dailyTaskToDbRecord = (task: DailyTaskData) => ({
  date: task.date.toISOString().split('T')[0],
  status: task.status,
  duration: task.duration,
  notes: task.notes,
  workout_type: task.workoutType,
});

/**
 * 获取所有每日任务
 */
export const getAllDailyTasks = async (): Promise<DailyTaskData[]> => {
  const db = await getDatabase();
  const results = await db.getAllAsync('SELECT * FROM daily_tasks ORDER BY date ASC');
  return results.map(dbRecordToDailyTask);
};

/**
 * 获取指定日期的任务
 */
export const getDailyTaskByDate = async (date: Date): Promise<DailyTaskData | null> => {
  const db = await getDatabase();
  const dateStr = date.toISOString().split('T')[0];
  const result = await db.getFirstAsync('SELECT * FROM daily_tasks WHERE date = ?', dateStr);
  return result ? dbRecordToDailyTask(result) : null;
};

/**
 * 插入或更新每日任务
 */
export const upsertDailyTask = async (task: DailyTaskData): Promise<void> => {
  const db = await getDatabase();
  const record = dailyTaskToDbRecord(task);
  const now = new Date().toISOString();

  await db.runAsync(`
    INSERT OR REPLACE INTO daily_tasks
    (date, status, duration, notes, workout_type, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    record.date,
    record.status,
    record.duration ?? null,
    record.notes ?? null,
    record.workout_type ?? null,
    now
  ]);
};

/**
 * 获取周目标
 */
export const getWeeklyGoal = async (weekNumber: number): Promise<WeeklyTaskData | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync('SELECT * FROM weekly_goals WHERE week_number = ?', weekNumber);

  if (!result) {
    return null;
  }

  // 类型断言
  const typedResult = result as {
    week_number: number;
    start_date: string;
    end_date: string;
    goal_duration: number;
  };

  // 获取该周的每日任务
  const startDate = new Date(typedResult.start_date);
  const endDate = new Date(typedResult.end_date);

  // 修正：getWeekDays 不需要参数，或修改为接受起始日期
  const days = getWeekDays();

  // 获取这一周的每日任务
  const dailyTasks = await getAllDailyTasks();
  const weekDays = days.map((date) => {
    const task = dailyTasks.find((t) => t.date.toDateString() === date.toDateString());
    return task || { date, status: 'pending' as const };
  });

  // 计算统计数据
  const totalCompleted = weekDays
    .filter((day) => day.status === 'completed' && day.duration)
    .reduce((sum, day) => sum + (day.duration || 0), 0);

  const completionRate = Math.round((totalCompleted / (typedResult.goal_duration || DEFAULT_WEEKLY_GOAL)) * 100);

  return {
    weekNumber: typedResult.week_number,
    startDate: new Date(typedResult.start_date),
    endDate: new Date(typedResult.end_date),
    goal: typedResult.goal_duration || DEFAULT_WEEKLY_GOAL,
    days: weekDays,
    totalCompleted,
    completionRate,
  };
};

/**
 * 设置周目标
 */
export const setWeeklyGoal = async (
  weekNumber: number,
  startDate: Date,
  endDate: Date,
  goal: number = DEFAULT_WEEKLY_GOAL
): Promise<void> => {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(`
    INSERT OR REPLACE INTO weekly_goals
    (week_number, start_date, end_date, goal_duration, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `, [weekNumber, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], goal, now]);
};

/**
 * 初始化当前周期数据
 */
export const initCycleData = async (): Promise<TaskCycleData> => {
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const { startDate, endDate } = getCurrentWeekRange();

  // 确保当前周的目标存在
  const existingGoal = await getWeeklyGoal(currentWeek);
  if (!existingGoal) {
    await setWeeklyGoal(currentWeek, startDate, endDate, DEFAULT_WEEKLY_GOAL);
  }

  // 获取所有每日任务
  const dailyTasks = await getAllDailyTasks();

  // 如果数据库中没有数据，使用 mock 数据初始化
  if (dailyTasks.length === 0) {
    console.log('Database empty, initializing with mock data...');
    return await initializeWithMockData();
  }

  // 构建周期数据
  const weeks: WeeklyTaskData[] = [];

  // 生成8周的数据
  for (let weekNum = 1; weekNum <= 8; weekNum++) {
    const weekData = await getWeeklyGoal(weekNum);
    if (weekData) {
      weeks.push(weekData);
    } else {
      // 如果没有这周的数据，创建一个空的
      const mockData = createCycleData();
      const mockWeek = mockData.weeks.find((w) => w.weekNumber === weekNum);
      if (mockWeek) {
        weeks.push(mockWeek);
        // 保存到数据库
        await setWeeklyGoal(weekNum, mockWeek.startDate, mockWeek.endDate, mockWeek.goal);
        for (const day of mockWeek.days) {
          if (day.status !== 'pending') {
            await upsertDailyTask(day);
          }
        }
      }
    }
  }

  // 计算整体完成率和连续打卡天数
  const completedWeeks = weeks.filter((w) => w.weekNumber < currentWeek);
  const overallCompletionRate =
    completedWeeks.length > 0
      ? Math.round(completedWeeks.reduce((sum, w) => sum + w.completionRate, 0) / completedWeeks.length)
      : 0;

  // 计算连续打卡天数（简化计算）
  const streak = calculateStreak(dailyTasks);

  return {
    totalWeeks: 8,
    currentWeek,
    weeks,
    overallCompletionRate,
    streak,
  };
};

/**
 * 使用 mock 数据初始化数据库
 */
const initializeWithMockData = async (): Promise<TaskCycleData> => {
  const mockData = createCycleData();

  // 保存每周目标
  for (const week of mockData.weeks) {
    await setWeeklyGoal(week.weekNumber, week.startDate, week.endDate, week.goal);
  }

  // 保存每日任务
  for (const week of mockData.weeks) {
    for (const day of week.days) {
      if (day.status !== 'pending') {
        await upsertDailyTask(day);
      }
    }
  }

  return mockData;
};

/**
 * 计算连续打卡天数
 */
const calculateStreak = (tasks: DailyTaskData[]): number => {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 按日期降序排序
  const sortedTasks = [...tasks].sort((a, b) => b.date.getTime() - a.date.getTime());

  for (let i = 0; i < sortedTasks.length; i++) {
    const taskDate = new Date(sortedTasks[i].date);
    taskDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() !== expectedDate.getTime()) {
      break;
    }

    if (sortedTasks[i].status === 'completed') {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * 更新每日任务后重新计算周期数据
 */
export const updateDailyTaskAndRefresh = async (
  task: DailyTaskData
): Promise<TaskCycleData> => {
  await upsertDailyTask(task);
  return await initCycleData();
};
