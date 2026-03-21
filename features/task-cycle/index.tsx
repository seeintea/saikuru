import { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import PageHeader from './components/page-header';
import CurrentWeekCard from './components/current-week-card';
import WeekDaysList from './components/week-days-list';
import TaskCycleGrid from './components/task-cycle-grid';
import StatsOverview from './components/stats-overview';
import MonthlyCalendar from './components/monthly-calendar';
import Legend from './components/legend';
import LogWorkoutModal from './components/log-workout-modal';
import { createCycleData, updateDailyData } from './utils/mock-data';
import { getToday } from '@/utils/date-utils';
import { DailyTaskData } from './types';

export default function TaskCyclePage() {
  const [cycleData, setCycleData] = useState(createCycleData());
  const [modalVisible, setModalVisible] = useState(false);

  const currentWeekData = cycleData.weeks.find((w) => w.weekNumber === cycleData.currentWeek);

  // 获取所有日期数据，用于月视图日历
  const allDays: DailyTaskData[] = cycleData.weeks.flatMap((week) => week.days);

  const handleLogWorkout = () => {
    setModalVisible(true);
  };

  const handleSubmitLog = (duration: number, workoutType?: string, notes?: string) => {
    const today = getToday();
    const updatedWeeks = cycleData.weeks.map((weekData) => {
      if (weekData.weekNumber === cycleData.currentWeek) {
        return updateDailyData(weekData, today, duration);
      }
      return weekData;
    });
    setCycleData((prev) => ({ ...prev, weeks: updatedWeeks }));
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDayPress = (weekNumber: number, dayIndex: number) => {
    // 可以用于点击某一天打开详情或记录
    console.log('Day pressed in grid:', weekNumber, dayIndex);
  };

  const handleCalendarDayPress = (date: Date) => {
    // 可以用于点击月视图日历的某一天
    console.log('Day pressed in calendar:', date);
  };

  if (!currentWeekData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <PageHeader onLogWorkout={handleLogWorkout} />
        <CurrentWeekCard weekData={currentWeekData} />
        <WeekDaysList weekData={currentWeekData} />
        <StatsOverview cycleData={cycleData} />
        <TaskCycleGrid cycleData={cycleData} onDayPress={handleDayPress} />
        <MonthlyCalendar allDays={allDays} onDayPress={handleCalendarDayPress} />
        <Legend />
      </ScrollView>

      <LogWorkoutModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmitLog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  scrollContainer: {
    flex: 1,
  },
});
