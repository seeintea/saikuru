import { Card } from "@/components/ui/card";
import { FONTS } from "@/hooks/use-custom-fonts";
import type { WithViewStyle } from "@/types";
import type { TaskCycleConfig, TaskCycleProgress } from "@/types/task-cycle";
import { StyleSheet, Text, View } from "react-native";

interface SummaryProps extends WithViewStyle {
  cycleConfig: TaskCycleConfig;
  cycleProgress: TaskCycleProgress;
}

export function Summary({ style = {}, cycleConfig, cycleProgress }: SummaryProps) {
  // 计算进度百分比
  const countProgress = Math.min((cycleProgress.countCurrent / cycleConfig.countTarget) * 100, 100);
  const timeProgress = Math.min((cycleProgress.timeCurrent / cycleConfig.timeTarget) * 100, 100);

  // 格式化里程碑
  const formattedMilestones = cycleConfig.milestones.map((milestone) => {
    const isCompleted = cycleProgress.completedMilestones.includes(milestone.id);
    const currentValue = milestone.type === "count" ? cycleProgress.countCurrent : cycleProgress.timeCurrent;
    const remaining = milestone.target - currentValue;
    const progress = Math.min((currentValue / milestone.target) * 100, 100);

    return {
      ...milestone,
      isCompleted,
      remaining,
      progress,
    };
  });

  return (
    <Card style={[styles.summary, style]}>
      {/* 周期信息区域 */}
      <View style={styles.cycleInfo}>
        <Text style={styles.cycleText}>
          第 {cycleConfig.cycleNumber} / {cycleConfig.totalCycles} 周期 · 第 {cycleProgress.currentDay} 天
        </Text>
        <Text style={styles.cycleTarget}>
          目标: 打卡 {cycleConfig.countTarget} 次 / 累计 {cycleConfig.timeTarget} 分钟
        </Text>
      </View>

      {/* 双维度核心数据卡片 */}
      <View style={styles.dimensionCards}>
        <View style={styles.dimensionCard}>
          <Text style={styles.dimensionLabel}>打卡次数</Text>
          <View style={styles.dimensionContent}>
            <Text style={styles.dimensionValue}>{cycleProgress.countCurrent}</Text>
            <Text style={styles.dimensionUnit}>次</Text>
          </View>
          <Text style={styles.dimensionTarget}>/ {cycleConfig.countTarget} 次</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${countProgress}%`, backgroundColor: "#A3FF00" }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(countProgress)}%</Text>
          </View>
        </View>

        <View style={styles.dimensionCard}>
          <Text style={styles.dimensionLabel}>累计时间</Text>
          <View style={styles.dimensionContent}>
            <Text style={styles.dimensionValue}>{cycleProgress.timeCurrent}</Text>
            <Text style={styles.dimensionUnit}>分钟</Text>
          </View>
          <Text style={styles.dimensionTarget}>/ {cycleConfig.timeTarget} 分钟</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${timeProgress}%`, backgroundColor: "#A3FF00" }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(timeProgress)}%</Text>
          </View>
        </View>
      </View>

      {/* 里程碑展示区域 */}
      <View style={styles.milestones}>
        <Text style={styles.milestonesTitle}>里程碑</Text>
        {formattedMilestones.map((milestone) => (
          <View key={milestone.id} style={styles.milestoneItem}>
            <View style={styles.milestoneLeft}>
              <Text style={styles.milestoneName}>{milestone.name}</Text>
              <Text style={styles.milestoneTarget}>
                {milestone.target} {milestone.type === "count" ? "次" : "分钟"}
              </Text>
            </View>
            <View style={styles.milestoneRight}>
              {milestone.isCompleted ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>已达成</Text>
                </View>
              ) : (
                <Text style={styles.remainingText}>
                  {milestone.remaining > 0 ? `还需 ${milestone.remaining}` : "已完成"}
                </Text>
              )}
            </View>
            <View style={styles.milestoneProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${milestone.progress}%`,
                      backgroundColor: milestone.isCompleted ? "#A3FF00" : "#FF6B6B",
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 周期进度概览 */}
      <View style={styles.cycleOverview}>
        <Text style={styles.overviewTitle}>周期进度概览</Text>
        <View style={styles.overviewContent}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>打卡天数</Text>
            <Text style={styles.overviewValue}>{cycleProgress.dailyRecords.length} 天</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>平均每日</Text>
            <Text style={styles.overviewValue}>
              {cycleProgress.dailyRecords.length > 0
                ? `${Math.round(cycleProgress.timeCurrent / cycleProgress.dailyRecords.length)} 分钟`
                : "0 分钟"}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  summary: {
    minHeight: 500,
    backgroundColor: "rgba(32, 32, 32, 0.75)",
  },
  cycleInfo: {
    marginBottom: 24,
  },
  cycleText: {
    fontSize: 16,
    fontFamily: FONTS.dingTalkJinBuTi,
    fontWeight: 600,
    color: "#888888",
    marginBottom: 4,
  },
  cycleTarget: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
  },
  dimensionCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  dimensionCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
  },
  dimensionLabel: {
    fontSize: 12,
    fontFamily: FONTS.alimamaAgile,
    color: "#888888",
    marginBottom: 8,
  },
  dimensionContent: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  dimensionValue: {
    fontSize: 24,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  dimensionUnit: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#888888",
    marginLeft: 4,
  },
  dimensionTarget: {
    fontSize: 12,
    fontFamily: FONTS.alimamaAgile,
    color: "#888888",
    marginBottom: 12,
  },
  progressBarContainer: {
    alignItems: "center",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontFamily: FONTS.alimamaAgile,
    color: "#888888",
  },
  milestones: {
    marginBottom: 32,
  },
  milestonesTitle: {
    fontSize: 16,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  milestoneItem: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  milestoneLeft: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  milestoneTarget: {
    fontSize: 12,
    fontFamily: FONTS.alimamaAgile,
    color: "#888888",
  },
  milestoneRight: {
    alignSelf: "flex-start",
  },
  completedBadge: {
    backgroundColor: "#A3FF00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    fontSize: 10,
    fontFamily: FONTS.alimamaAgile,
    color: "#000000",
    fontWeight: "bold",
  },
  remainingText: {
    fontSize: 12,
    fontFamily: FONTS.alimamaAgile,
    color: "#FF6B6B",
  },
  milestoneProgress: {
    marginTop: 8,
  },
  cycleOverview: {
    marginTop: 24,
  },
  overviewTitle: {
    fontSize: 16,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  overviewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewItem: {
    alignItems: "center",
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: FONTS.alimamaAgile,
    color: "#888888",
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
