import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { WeeklyTaskData } from '@/features/task-cycle/types';
import DayCell from './day-cell';
import { isToday } from '@/utils/date-utils';

interface WeekRowProps {
  weekData: WeeklyTaskData;
  isCurrentWeek?: boolean;
  onDayPress?: (weekNumber: number, day: number) => void;
}

export default function WeekRow({ weekData, isCurrentWeek, onDayPress }: WeekRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={[styles.weekNumber, isCurrentWeek && styles.currentWeekNumber]}>
          {weekData.weekNumber}
        </Text>
        <Text style={styles.weekLabel}>周</Text>
      </View>

      <View style={styles.daysContainer}>
        {weekData.days.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            size="medium"
            onPress={() => onDayPress?.(weekData.weekNumber, index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 40,
  },
  weekNumber: {
    color: '#ECEDEE',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentWeekNumber: {
    color: '#A3FF00',
  },
  weekLabel: {
    color: '#9BA1A6',
    fontSize: 12,
    marginTop: -2,
  },
  daysContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
