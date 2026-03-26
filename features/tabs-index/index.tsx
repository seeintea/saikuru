import { CustomCalendar } from "@/components/custom-calendar";
import { tabPaddingBottom } from "@/components/tab-screen-wrapper";
import { Card } from "@/components/ui/card";
import type { TaskCycleConfig, TaskCycleProgress } from "@/types/task-cycle";
import { ScrollView, StyleSheet, View } from "react-native";
import { Header } from "./components/header";
import { Summary } from "./components/summary";

// 示例数据
const sampleCycleConfig: TaskCycleConfig = {
  id: "1",
  cycleNumber: 2,
  totalCycles: 10,
  cycleDays: 80,
  countTarget: 5,
  timeTarget: 50,
  milestones: [
    // { id: "m1", name: "里程碑 A", target: 10, type: "count" },
    // { id: "m2", name: "里程碑 B", target: 15, type: "count" },
    // { id: "m3", name: "时间里程碑 A", target: 20, type: "time" },
    { id: "m4", name: "时间里程碑 B", target: 40, type: "time" },
  ],
};

const sampleCycleProgress: TaskCycleProgress = {
  currentDay: 23,
  countCurrent: 10,
  timeCurrent: 15,
  dailyRecords: [
    { date: "2026-03-20", count: 1, duration: 10 },
    { date: "2026-03-21", count: 1, duration: 5 },
  ],
  completedMilestones: ["m1"],
};

export function TabsIndex() {
  return (
    <View style={{ flex: 1 }}>
      <Header style={common.px24} />
      <ScrollView style={{ flex: 1, paddingBottom: tabPaddingBottom }}>
        <Summary
          style={[common.mt24, common.mx24]}
          cycleConfig={sampleCycleConfig}
          cycleProgress={sampleCycleProgress}
        />
        <Card style={[common.mx24, styles.calendar]}>
          <CustomCalendar />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    marginTop: 24,
  },
});

const common = StyleSheet.create({
  px24: {
    paddingInline: 24,
  },
  mx24: {
    marginInline: 24,
  },
  mt24: {
    marginTop: 24,
  },
});
