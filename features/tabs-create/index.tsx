import { Input, TextArea } from "@/components/ui/input";
import { InputSpinner } from "@/components/ui/input-spinner";
import { Segmented } from "@/components/ui/segmented";
import { FONTS } from "@/hooks/use-custom-fonts";
import { Plus, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Heading } from "./components/heading";

const colorPrimary = "#a3ff00";
const colorCard = "#1f1f1f";
const colorPlaceholder = "#6c7180";
const colorSecondary = "#9ba1a6";
const colorSecondaryForeground = "#000000";
const colorDestructive = "#ff4d4d";
const colorBackground = "#141414";

interface Milestone {
  id: number;
  name: string;
  count: number;
}

export function TabsCreate() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, name: "初步达成", count: 5 },
    { id: 2, name: "进阶挑战", count: 15 },
  ]);
  const [logicOperator, setLogicOperator] = useState<"and" | "or">("and");
  const [nextMilestoneId, setNextMilestoneId] = useState(3);

  // 日期选择器状态
  const [startDate, setStartDate] = useState<Date>(new Date("2026-03-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2026-04-01"));
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(null);

  // 选择器滚动位置
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // 生成年份数据（2020-2030）
  const years = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => 2020 + i);
  }, []);

  // 生成月份数据
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  // 生成天数数据（根据年月动态计算）
  const days = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth]);

  // 确保日期在新月份/年份中有效
  const ensureDateValidity = (year: number, month: number, day: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Math.min(day, daysInMonth);
  };

  // 显示日期选择器
  const showStartPicker = () => {
    setSelectedYear(startDate.getFullYear());
    setSelectedMonth(startDate.getMonth() + 1);
    setSelectedDay(startDate.getDate());
    setActivePicker("start");
  };

  const showEndPicker = () => {
    setSelectedYear(endDate.getFullYear());
    setSelectedMonth(endDate.getMonth() + 1);
    setSelectedDay(endDate.getDate());
    setActivePicker("end");
  };

  // 更新年份
  const onYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    // 确保日期在新年份的月份中有效
    const validDay = ensureDateValidity(newYear, selectedMonth, selectedDay);
    if (validDay !== selectedDay) {
      setSelectedDay(validDay);
    }
  };

  // 更新月份
  const onMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    // 确保日期在新月份中有效
    const validDay = ensureDateValidity(selectedYear, newMonth, selectedDay);
    if (validDay !== selectedDay) {
      setSelectedDay(validDay);
    }
  };

  // 确认日期选择
  const confirmDate = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    if (activePicker === "start") {
      setStartDate(newDate);
    } else {
      setEndDate(newDate);
    }
    setActivePicker(null);
  };

  // 取消日期选择
  const cancelDate = () => {
    setActivePicker(null);
  };

  // 格式化日期为 YYYY/MM/DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const addMilestone = () => {
    setMilestones([...milestones, { id: nextMilestoneId, name: "新里程碑", count: 1 }]);
    setNextMilestoneId(nextMilestoneId + 1);
  };

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: number, field: keyof Milestone, value: string | number) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  return (
    <ScrollView
      className={"flex-1 w-full p-6"}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-8">
        {/* 基本信息 */}
        <View>
          <Heading title="基本信息" />
          <View className={"gap-4 mt-4"}>
            <Text style={styles.label}>任务名称</Text>
            <Input placeholder="例如：每日高强度间歇训练" />
            <Text style={styles.label}>任务描述</Text>
            <TextArea placeholder="描述您的训练目标或注意事项..." classNames={{ body: "h-24" }} />
          </View>
        </View>

        {/* 周期设置 */}
        <View>
          <Heading title="周期设置" />
          <View className={"gap-4 mt-4"}>
            <Segmented
              options={[
                { key: "day", label: "天" },
                { key: "week", label: "周" },
                { key: "month", label: "月" },
              ]}
              defaultValue="day"
              onChange={(value) => console.log("Selected:", value)}
            />
            <View className="flex-row items-center justify-between">
              <Text style={styles.label}>重复周期</Text>
              <View className="w-1/2">
                <InputSpinner />
              </View>
            </View>

            {/* 日期范围选择 */}
            <View className="gap-2">
              <Text style={styles.label}>周期范围</Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity style={styles.dateButton} onPress={showStartPicker}>
                  <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                <Text style={styles.dateSeparator}>-</Text>
                <TouchableOpacity style={styles.dateButton} onPress={showEndPicker}>
                  <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 自定义日期选择器 Modal */}
        <Modal
          visible={activePicker !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setActivePicker(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* 标题 */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {activePicker === "start" ? "选择开始日期" : "选择结束日期"}
                </Text>
              </View>

              {/* 日期选择器 */}
              <View style={styles.pickerContainer}>
                {/* 年份选择 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>年</Text>
                  <FlatList
                    data={years}
                    keyExtractor={(item) => `year-${item}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          selectedYear === item && styles.pickerItemSelected,
                        ]}
                        onPress={() => onYearChange(item)}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            selectedYear === item && styles.pickerItemTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.pickerList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerContent}
                  />
                </View>

                {/* 月份选择 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>月</Text>
                  <FlatList
                    data={months}
                    keyExtractor={(item) => `month-${item}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          selectedMonth === item && styles.pickerItemSelected,
                        ]}
                        onPress={() => onMonthChange(item)}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            selectedMonth === item && styles.pickerItemTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.pickerList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerContent}
                  />
                </View>

                {/* 日期选择 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>日</Text>
                  <FlatList
                    data={days}
                    keyExtractor={(item) => `day-${item}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          selectedDay === item && styles.pickerItemSelected,
                        ]}
                        onPress={() => setSelectedDay(item)}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            selectedDay === item && styles.pickerItemTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.pickerList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerContent}
                  />
                </View>
              </View>

              {/* 确认/取消按钮 */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelDate}>
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmDate}>
                  <Text style={styles.confirmButtonText}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 目标设置 */}
        <View>
          <Heading title="目标设置" />
          <View className={"gap-4 mt-4"}>
            <View style={styles.goalCard}>
              <Text style={styles.label}>打卡次数目标</Text>
              <View className="flex-row items-center gap-3 mt-2">
                <Text style={styles.goalNumber}>0</Text>
                <Text style={styles.goalUnit}>次</Text>
              </View>
            </View>

            <View style={styles.goalCard}>
              <Text style={styles.label}>累计时间目标</Text>
              <View className="flex-row items-center gap-3 mt-2">
                <Text style={styles.goalNumber}>0</Text>
                <Text style={styles.goalUnit}>分钟</Text>
              </View>
            </View>

            {/* 逻辑运算符 */}
            <View className="flex-row gap-3 justify-center">
              <TouchableOpacity
                style={[styles.logicButton, logicOperator === "and" && styles.logicButtonActive]}
                onPress={() => setLogicOperator("and")}
              >
                <Text
                  style={[styles.logicButtonText, logicOperator === "and" && styles.logicButtonTextActive]}
                >
                  且 (AND)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.logicButton, logicOperator === "or" && styles.logicButtonActive]}
                onPress={() => setLogicOperator("or")}
              >
                <Text
                  style={[styles.logicButtonText, logicOperator === "or" && styles.logicButtonTextActive]}
                >
                  或 (OR)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 里程碑设置 */}
        <View>
          <Heading title="里程碑设置" extra={<Text style={styles.milestoneExtra}>阶梯式激励</Text>} />
          <View className={"gap-3 mt-4"}>
            {milestones.map((milestone) => (
              <View key={milestone.id} style={styles.milestoneCard}>
                <View style={styles.milestoneContent}>
                  <View style={styles.milestoneNameContainer}>
                    <Text style={styles.milestoneName}>{milestone.name}</Text>
                  </View>
                  <View style={styles.milestoneCountContainer}>
                    <Text style={styles.milestoneCount}>{milestone.count}</Text>
                    <Text style={styles.milestoneCountLabel}>次</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.milestoneDelete}
                  onPress={() => removeMilestone(milestone.id)}
                >
                  <Trash2 color={colorDestructive} size={18} />
                </TouchableOpacity>
              </View>
            ))}

            {/* 添加里程碑按钮 */}
            <TouchableOpacity style={styles.addMilestoneButton} onPress={addMilestone}>
              <Plus color={colorPrimary} size={20} />
              <Text style={styles.addMilestoneText}>添加里程碑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 创建任务按钮 */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>创建任务</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: "#767575",
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "600",
  },
  goalCard: {
    backgroundColor: colorCard,
    borderRadius: 24,
    padding: 16,
  },
  goalNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: colorPlaceholder,
    fontFamily: FONTS.alibabaPuHui,
  },
  goalUnit: {
    fontSize: 14,
    color: colorSecondary,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "500",
  },
  logicButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colorCard,
  },
  logicButtonActive: {
    backgroundColor: colorPrimary,
  },
  logicButtonText: {
    fontSize: 12,
    color: colorSecondary,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "600",
  },
  logicButtonTextActive: {
    color: colorSecondaryForeground,
  },
  milestoneExtra: {
    fontSize: 12,
    color: colorPlaceholder,
    fontFamily: FONTS.alibabaPuHui,
  },
  milestoneCard: {
    backgroundColor: colorCard,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  milestoneContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  milestoneNameContainer: {
    flex: 1,
    backgroundColor: colorBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateButton: {
    backgroundColor: colorCard,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "600",
  },
  dateSeparator: {
    fontSize: 18,
    color: colorSecondary,
    fontWeight: "700",
  },
  // 自定义日期选择器样式
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colorCard,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "600",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 12,
    color: colorPlaceholder,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "500",
    marginBottom: 12,
  },
  pickerList: {
    maxHeight: 200,
    width: "100%",
  },
  pickerContent: {
    alignItems: "center",
  },
  pickerItem: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 16,
  },
  pickerItemSelected: {
    backgroundColor: colorPrimary,
  },
  pickerItemText: {
    fontSize: 18,
    color: colorSecondary,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "500",
  },
  pickerItemTextSelected: {
    color: colorSecondaryForeground,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: colorSecondary,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: colorPrimary,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    color: colorSecondaryForeground,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "700",
  },
  milestoneName: {
    fontSize: 14,
    color: "#ffffff",
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "600",
  },
  milestoneCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colorBackground,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 4,
  },
  milestoneCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: FONTS.alibabaPuHui,
  },
  milestoneCountLabel: {
    fontSize: 12,
    color: colorSecondary,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "500",
  },
  milestoneDelete: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    borderRadius: 12,
  },
  addMilestoneButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: colorPrimary,
    borderStyle: "dashed",
    borderRadius: 24,
  },
  addMilestoneText: {
    fontSize: 14,
    color: colorPrimary,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: colorPrimary,
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    color: colorSecondaryForeground,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: "700",
  },
});
