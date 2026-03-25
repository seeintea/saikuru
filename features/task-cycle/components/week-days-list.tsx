import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { WeeklyTaskData, DailyTaskData, TaskCycleData } from "@/features/task-cycle/types";
import { getDayName, isToday } from "@/utils/date-utils";
import { STATUS_COLORS } from "@/features/task-cycle/constants";

interface WeekDaysListProps {
  weekData: WeeklyTaskData;
  cycleData?: TaskCycleData; // 可选，用于获取所有数据
  daysToShow?: number;
  onDayPress?: (day: DailyTaskData) => void;
}

const DayItem = ({ day }: { day: DailyTaskData }) => {
  const isTodayDate = isToday(day.date);
  const statusColor = STATUS_COLORS[day.status];

  return (
    <View style={[styles.dayItem, isTodayDate && styles.todayItem]}>
      <View style={styles.dayInfo}>
        <Text style={[styles.dayName, isTodayDate && styles.todayText]}>{getDayName(day.date)}</Text>
        <Text style={[styles.dayNumber, isTodayDate && styles.todayText]}>{day.date.getDate()}</Text>
        <Text style={styles.monthText}>{day.date.getMonth() + 1}月</Text>
      </View>
      <View style={styles.statusSection}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.statusText}>
          {day.status === "completed" ? "已完成" : day.status === "missed" ? "未完成" : "待记录"}
        </Text>
        {day.duration && <Text style={styles.durationText}>{day.duration}分钟</Text>}
      </View>
    </View>
  );
};

export default function WeekDaysList({ weekData, cycleData, daysToShow = 10 }: WeekDaysListProps) {
  // 获取所有天数的数据
  let allDays: DailyTaskData[];
  if (cycleData) {
    allDays = cycleData.weeks.flatMap((week) => week.days);
  } else {
    allDays = weekData.days;
  }

  // 按日期倒序排列
  allDays.sort((a, b) => b.date.getTime() - a.date.getTime());

  // 筛选出今天及之前的记录
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const pastAndTodayDays = allDays.filter((day) => day.date <= today);

  // 截取要显示的天数
  const daysToDisplay = pastAndTodayDays.slice(0, daysToShow);

  // 检查是否有更多记录
  const hasMoreRecords = pastAndTodayDays.length > daysToShow;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>最近记录</Text>
      <View style={styles.list}>
        {daysToDisplay.map((day, index) => (
          <DayItem key={index} day={day} />
        ))}
        {hasMoreRecords && (
          <TouchableOpacity style={styles.viewMoreButton} activeOpacity={0.7}>
            <Link href="/records" asChild>
              <Text style={styles.viewMoreText}>查看更多</Text>
            </Link>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  title: {
    color: "#ECEDEE",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  list: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3D3D3D",
  },
  viewMoreButton: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
  viewMoreText: {
    color: "#A3FF00",
    fontSize: 14,
    fontWeight: "500",
  },
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  todayItem: {
    backgroundColor: "rgba(163, 255, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(163, 255, 0, 0.3)",
  },
  dayInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayName: {
    color: "#9BA1A6",
    fontSize: 14,
    width: 20,
  },
  dayNumber: {
    color: "#ECEDEE",
    fontSize: 16,
    fontWeight: "500",
    width: 24,
  },
  monthText: {
    color: "#9BA1A6",
    fontSize: 14,
  },
  todayText: {
    color: "#A3FF00",
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: "#9BA1A6",
    fontSize: 14,
    width: 60,
  },
  durationText: {
    color: "#ECEDEE",
    fontSize: 14,
    fontWeight: "500",
  },
});
