import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { createCycleData } from '@/features/task-cycle/utils/mock-data';
import { DailyTaskData } from '@/features/task-cycle/types';
import { getDayName, isToday } from '@/utils/date-utils';
import { STATUS_COLORS } from '@/features/task-cycle/constants';

const DayItem = ({ day }: { day: DailyTaskData }) => {
  const isTodayDate = isToday(day.date);
  const statusColor = STATUS_COLORS[day.status];

  return (
    <View style={[styles.dayItem, isTodayDate && styles.todayItem]}>
      <View style={styles.dayInfo}>
        <Text style={[styles.dayName, isTodayDate && styles.todayText]}>
          {getDayName(day.date)}
        </Text>
        <Text style={[styles.dayNumber, isTodayDate && styles.todayText]}>
          {day.date.getDate()}
        </Text>
        <Text style={styles.monthText}>
          {day.date.getMonth() + 1}月
        </Text>
      </View>
      <View style={styles.statusSection}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.statusText}>
          {day.status === 'completed' ? '已完成' : day.status === 'missed' ? '未完成' : '待记录'}
        </Text>
        {day.duration && <Text style={styles.durationText}>{day.duration}分钟</Text>}
      </View>
    </View>
  );
};

export default function RecordsScreen() {
  const params = useLocalSearchParams();
  const cycleData = createCycleData();

  // 获取所有记录的天数
  const allDays: DailyTaskData[] = cycleData.weeks.flatMap((week) => week.days);

  // 按日期排序
  allDays.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{allDays.length}天记录</Text>

        <View style={styles.list}>
          {allDays.map((day, index) => (
            <DayItem key={index} day={day} />
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 100,
  },
  subtitle: {
    color: '#9BA1A6',
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  list: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  todayItem: {
    backgroundColor: 'rgba(163, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(163, 255, 0, 0.3)',
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayName: {
    color: '#9BA1A6',
    fontSize: 14,
    width: 20,
  },
  dayNumber: {
    color: '#ECEDEE',
    fontSize: 16,
    fontWeight: '500',
    width: 24,
  },
  monthText: {
    color: '#9BA1A6',
    fontSize: 14,
  },
  todayText: {
    color: '#A3FF00',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#9BA1A6',
    fontSize: 14,
    width: 60,
  },
  durationText: {
    color: '#ECEDEE',
    fontSize: 14,
    fontWeight: '500',
  },
});
