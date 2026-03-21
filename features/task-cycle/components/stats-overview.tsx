import { StyleSheet, Text, View } from 'react-native';
import { TaskCycleData } from '@/features/task-cycle/types';
import { Target, Calendar, Timer, Flame } from 'lucide-react-native';

interface StatsOverviewProps {
  cycleData: TaskCycleData;
}

const StatItem = ({
  icon: Icon,
  label,
  value,
  color = '#ECEDEE',
}: {
  icon: any;
  label: string;
  value: string | number;
  color?: string;
}) => (
  <View style={styles.statItem}>
    <View style={styles.iconContainer}>
      <Icon size={20} color="#A3FF00" strokeWidth={2} />
    </View>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

export default function StatsOverview({ cycleData }: StatsOverviewProps) {
  const { weeks, currentWeek, overallCompletionRate, streak } = cycleData;

  // 计算总完成天数
  const totalCompletedDays = weeks.reduce((sum, week) => {
    return sum + week.days.filter((day) => day.status === 'completed').length;
  }, 0);

  // 计算总天数（已过的周）
  const totalDays = weeks.reduce((sum, week) => {
    if (week.weekNumber < currentWeek) {
      return sum + week.days.length;
    } else if (week.weekNumber === currentWeek) {
      const today = new Date().getDate();
      const weekStart = week.startDate.getDate();
      return sum + Math.min(today - weekStart + 1, week.days.length);
    }
    return sum;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>统计概览</Text>
      <View style={styles.statsGrid}>
        <StatItem
          icon={Target}
          label="完成率"
          value={`${overallCompletionRate}%`}
          color="#A3FF00"
        />
        <StatItem icon={Flame} label="连续打卡" value={`${streak}天`} color="#FFD700" />
        <StatItem icon={Calendar} label="已打卡天数" value={`${totalCompletedDays}天`} />
        <StatItem
          icon={Timer}
          label="总锻炼时长"
          value={`${weeks.reduce((sum, week) => sum + week.totalCompleted, 0)}分钟`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    color: '#ECEDEE',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: (360 - 48) / 2, // 响应式宽度
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(163, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#9BA1A6',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
