import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DailyTaskData } from '@/features/task-cycle/types';
import { getDayName, isToday } from '@/utils/date-utils';
import { STATUS_COLORS } from '@/features/task-cycle/constants';

interface DayCellProps {
  day: DailyTaskData;
  onPress?: (day: DailyTaskData) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function DayCell({ day, onPress, size = 'medium' }: DayCellProps) {
  const isTodayDate = isToday(day.date);
  const statusColor = STATUS_COLORS[day.status];

  const getContainerSize = () => {
    switch (size) {
      case 'small':
        return { width: 38, height: 46, borderRadius: 8, padding: 4 };
      case 'large':
        return { width: 52, height: 62, borderRadius: 12, padding: 8 };
      case 'medium':
      default:
        return { width: 44, height: 54, borderRadius: 10, padding: 6 };
    }
  };

  const getDayNameSize = () => (size === 'small' ? 10 : size === 'large' ? 12 : 11);
  const getDayNumberSize = () => (size === 'small' ? 14 : size === 'large' ? 18 : 16);

  const containerSize = getContainerSize();

  const CellContent = () => (
    <View
      style={[
        styles.container,
        containerSize,
        isTodayDate && styles.todayContainer,
        { borderColor: isTodayDate ? '#A3FF00' : '#3D3D3D' },
      ]}
    >
      <Text
        style={[styles.dayName, { fontSize: getDayNameSize() }, isTodayDate && styles.todayText]}
      >
        {getDayName(day.date)}
      </Text>
      <Text
        style={[
          styles.dayNumber,
          { fontSize: getDayNumberSize() },
          isTodayDate && styles.todayText,
        ]}
      >
        {day.date.getDate()}
      </Text>
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={() => onPress(day)} activeOpacity={0.7}>
        <CellContent />
      </TouchableOpacity>
    );
  }

  return <CellContent />;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderColor: '#3D3D3D',
  },
  todayContainer: {
    backgroundColor: 'rgba(163, 255, 0, 0.1)',
    borderColor: '#A3FF00',
  },
  dayName: {
    color: '#9BA1A6',
    fontWeight: '500',
  },
  dayNumber: {
    color: '#ECEDEE',
    fontWeight: 'bold',
  },
  todayText: {
    color: '#A3FF00',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
