import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { DailyTaskData, TaskCompletionStatus } from '@/features/task-cycle/types';
import {
  CalendarMonthData,
  CalendarDayData,
  getCalendarMonthData,
  getPreviousMonth,
  getNextMonth,
  getWeekDayName,
  buildDailyTasksMap,
} from '@/features/task-cycle/utils/monthly-calendar-utils';
import { STATUS_COLORS } from '@/features/task-cycle/constants';

interface MonthlyCalendarProps {
  allDays: DailyTaskData[];
  onDayPress?: (date: Date) => void;
  defaultDate?: Date;
}

const CalendarDay = ({
  data,
  onPress,
}: {
  data: CalendarDayData;
  onPress?: (date: Date) => void;
}) => {
  const statusColor = data.status
    ? STATUS_COLORS[data.status as keyof typeof STATUS_COLORS]
    : 'transparent';

  const baseStyle = [
    styles.dayCell,
    !data.isCurrentMonth && styles.otherMonthDay,
    data.isToday && styles.todayDay,
  ];

  const DayContent = () => (
    <View style={baseStyle}>
      <Text
        style={[
          styles.dayNumber,
          data.isToday && styles.todayText,
          !data.isCurrentMonth && styles.otherMonthText,
        ]}
      >
        {data.dayNumber}
      </Text>
      {data.status && (
        <View
          style={[
            styles.statusDot,
            { backgroundColor: statusColor },
            data.isToday && { borderColor: '#A3FF00', borderWidth: 1 },
          ]}
        />
      )}
    </View>
  );

  if (onPress && data.isCurrentMonth) {
    return (
      <TouchableOpacity onPress={() => onPress(data.date)} activeOpacity={0.7}>
        <DayContent />
      </TouchableOpacity>
    );
  }

  return <DayContent />;
};

export default function MonthlyCalendar({
  allDays,
  onDayPress,
  defaultDate = new Date(),
}: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(defaultDate);

  const dailyTasksMap = useMemo(() => buildDailyTasksMap(allDays), [allDays]);

  const calendarData = useMemo(
    () => getCalendarMonthData(currentDate, dailyTasksMap),
    [currentDate, dailyTasksMap]
  );

  const handlePreviousMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  const weekRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      rows.push(calendarData.days.slice(i * 7, i * 7 + 7));
    }
    return rows;
  }, [calendarData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>月视图日历</Text>

      <View style={styles.calendarCard}>
        {/* 头部 - 月份标题和导航 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handlePreviousMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color="#ECEDEE" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>
            {calendarData.year}年 {calendarData.monthName}
          </Text>

          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton} activeOpacity={0.7}>
            <ChevronRight size={20} color="#ECEDEE" />
          </TouchableOpacity>
        </View>

        {/* 周几表头 */}
        <View style={styles.weekHeader}>
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <Text key={dayIndex} style={styles.weekDayHeader}>
              {getWeekDayName(dayIndex)}
            </Text>
          ))}
        </View>

        {/* 日期网格 */}
        <View style={styles.daysGrid}>
          {weekRows.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day, dayIndex) => (
                <CalendarDay key={`${weekIndex}-${dayIndex}`} data={day} onPress={onDayPress} />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
  },
  title: {
    color: '#ECEDEE',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  calendarCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    color: '#ECEDEE',
    fontSize: 18,
    fontWeight: '600',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayHeader: {
    color: '#9BA1A6',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    width: (320 - 32) / 7,
  },
  daysGrid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: (320 - 32) / 7,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  todayDay: {
    backgroundColor: 'rgba(163, 255, 0, 0.1)',
    borderColor: '#A3FF00',
  },
  dayNumber: {
    color: '#ECEDEE',
    fontSize: 16,
    fontWeight: '500',
  },
  otherMonthText: {
    color: '#687076',
  },
  todayText: {
    color: '#A3FF00',
    fontWeight: 'bold',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
