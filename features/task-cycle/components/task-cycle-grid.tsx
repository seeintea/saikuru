import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TaskCycleData } from '@/features/task-cycle/types';
import WeekRow from './week-row';
import { formatDateRange } from '@/utils/date-utils';

interface TaskCycleGridProps {
  cycleData: TaskCycleData;
  onDayPress?: (weekNumber: number, dayIndex: number) => void;
}

export default function TaskCycleGrid({ cycleData, onDayPress }: TaskCycleGridProps) {
  const { weeks, currentWeek } = cycleData;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>周期概览（8周）</Text>

      <View style={styles.weekHeaders}>
        <View style={styles.leftHeader} />
        <View style={styles.daysHeaders}>
          {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
            <Text key={index} style={styles.dayHeaderText}>
              {day}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {weeks.map((weekData, index) => (
          <WeekRow
            key={weekData.weekNumber}
            weekData={weekData}
            isCurrentWeek={weekData.weekNumber === currentWeek}
            onDayPress={onDayPress}
          />
        ))}
      </ScrollView>
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
  weekHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  leftHeader: {
    width: 52,
  },
  daysHeaders: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayHeaderText: {
    color: '#9BA1A6',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: 44,
  },
  scrollContainer: {
    marginBottom: 20,
  },
});
