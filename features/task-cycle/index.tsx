import { getToday } from '@/utils/date-utils';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import CurrentWeekCard from './components/current-week-card';
import Legend from './components/legend';
import LogWorkoutModal from './components/log-workout-modal';
import MonthlyCalendar from './components/monthly-calendar';
import PageHeader from './components/page-header';
import WeekDaysList from './components/week-days-list';
import { DailyTaskData } from './types';
import useDatabase from '@/hooks/use-database';

export default function TaskCyclePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const { cycleData, isLoading, error, logWorkout } = useDatabase();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A3FF00" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>出错了: {error.message}</Text>
      </View>
    );
  }

  if (!cycleData) {
    return null;
  }

  const currentWeekData = cycleData.weeks.find((w) => w.weekNumber === cycleData.currentWeek);

  // 获取所有日期数据，用于月视图日历
  const allDays: DailyTaskData[] = cycleData.weeks.flatMap((week) => week.days);

  const handleLogWorkout = () => {
    setModalVisible(true);
  };

  const handleSubmitLog = async (duration: number, workoutType?: string, notes?: string) => {
    const today = getToday();
    const success = await logWorkout(today, duration, workoutType, notes);
    if (success) {
      setModalVisible(false);
    }
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
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PageHeader onLogWorkout={handleLogWorkout} />
        <View style={styles.componentWrapper}>
          <CurrentWeekCard weekData={currentWeekData} />
        </View>
        <View style={styles.componentWrapper}>
          <MonthlyCalendar allDays={allDays} onDayPress={handleCalendarDayPress} />
        </View>
        <View style={styles.componentWrapper}>
          <Legend />
        </View>
        <View style={styles.componentWrapper}>
          <WeekDaysList
            weekData={currentWeekData}
            cycleData={cycleData}
            daysToShow={10}
          />
        </View>
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
  scrollContent: {
    paddingBottom: 100, // 为底部悬浮 tab 留出空间
  },
  componentWrapper: {
    marginTop: 16, // 统一的组件间距
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  loadingText: {
    color: '#9BA1A6',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
});
