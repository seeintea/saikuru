import { StyleSheet, Text, View } from "react-native";
import { WeeklyTaskData } from "@/features/task-cycle/types";
import { formatDateRange, getRemainingDays } from "@/utils/date-utils";

interface CurrentWeekCardProps {
  weekData: WeeklyTaskData;
}

export default function CurrentWeekCard({ weekData }: CurrentWeekCardProps) {
  const remaining = weekData.goal - weekData.totalCompleted;
  const remainingDays = getRemainingDays(weekData.endDate);
  const percent = Math.min(weekData.completionRate, 100);
  const remainingNeeded = Math.max(0, remaining);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.weekLabel}>当前周：第{weekData.weekNumber}周</Text>
        <Text style={styles.dateRange}>{formatDateRange(weekData.startDate, weekData.endDate)}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>本周目标</Text>
          <Text style={styles.statValue}>{weekData.goal}分钟</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>已完成</Text>
          <Text style={styles.statValueCompleted}>{weekData.totalCompleted}分钟</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>剩余</Text>
          <Text style={styles.statValueRemaining}>{remainingNeeded}分钟</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.percentText}>{percent}%</Text>
      </View>

      {remainingDays > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            剩余 {remainingDays} 天，还需 {remainingNeeded} 分钟
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3D3D3D",
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  weekLabel: {
    color: "#ECEDEE",
    fontSize: 16,
    fontWeight: "600",
  },
  dateRange: {
    color: "#9BA1A6",
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#3D3D3D",
    marginHorizontal: 8,
  },
  statLabel: {
    color: "#9BA1A6",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#ECEDEE",
    fontSize: 18,
    fontWeight: "bold",
  },
  statValueCompleted: {
    color: "#A3FF00",
    fontSize: 18,
    fontWeight: "bold",
  },
  statValueRemaining: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: "#2D2D2D",
    borderRadius: 6,
    marginRight: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#A3FF00",
    borderRadius: 6,
  },
  percentText: {
    color: "#A3FF00",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 40,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#9BA1A6",
    fontSize: 14,
  },
});
