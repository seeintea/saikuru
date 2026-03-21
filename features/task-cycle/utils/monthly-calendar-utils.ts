import { DailyTaskData, TaskCompletionStatus } from '@/features/task-cycle/types';

// 月中每一天的数据
export interface CalendarDayData {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  status?: TaskCompletionStatus;
  duration?: number;
}

// 月视图数据
export interface CalendarMonthData {
  year: number;
  month: number;
  monthName: string;
  days: CalendarDayData[];
  daysInMonth: number;
  firstDayOfWeek: number;
}

const monthNames = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

const weekDayNames = ['日', '一', '二', '三', '四', '五', '六'];

// 获取指定日期所在月份的日历数据
export const getCalendarMonthData = (
  date: Date,
  dailyTasksMap: Map<string, DailyTaskData>
): CalendarMonthData => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  // 获取当月第一天
  const firstDay = new Date(year, month, 1);
  // 获取当月最后一天
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay(); // 0 是周日

  const days: CalendarDayData[] = [];

  // 添加上个月的天数（显示完整周）
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevMonthDate = new Date(year, month, -i);
    days.push({
      date: prevMonthDate,
      dayNumber: prevMonthDate.getDate(),
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // 添加当月的天数
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const taskData = dailyTasksMap.get(dateKey);

    const isTodayDate =
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

    days.push({
      date: currentDate,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isTodayDate,
      status: taskData?.status,
      duration: taskData?.duration,
    });
  }

  // 添加下个月的天数（使总天数为 42，显示完整的 6 周）
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const nextMonthDate = new Date(year, month + 1, day);
    days.push({
      date: nextMonthDate,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return {
    year,
    month,
    monthName: monthNames[month],
    days,
    daysInMonth,
    firstDayOfWeek,
  };
};

// 获取上个月的日期
export const getPreviousMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

// 获取下个月的日期
export const getNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

// 获取周几名称
export const getWeekDayName = (dayIndex: number): string => {
  return weekDayNames[dayIndex];
};

// 从周期数据构建每日任务的 Map（按日期字符串索引）
export const buildDailyTasksMap = (allDays: DailyTaskData[]): Map<string, DailyTaskData> => {
  const map = new Map<string, DailyTaskData>();

  allDays.forEach((day) => {
    const year = day.date.getFullYear();
    const month = String(day.date.getMonth() + 1).padStart(2, '0');
    const dayNum = String(day.date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${dayNum}`;
    map.set(dateKey, day);
  });

  return map;
};
