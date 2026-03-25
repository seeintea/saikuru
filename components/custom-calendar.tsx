import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export function CustomCalendar() {
  // 模拟数据：2026年3月的打卡状态
  const markedDates = {
    "2026-03-01": { dotColor: "#a3ff00", activeOpacity: 0 },
    "2026-03-02": { dotColor: "#a3ff00", activeOpacity: 0 },
    "2026-03-03": { dotColor: "#ff6b6b", activeOpacity: 0 },
    "2026-03-04": { dotColor: "#999", activeOpacity: 0 },
    "2026-03-05": { dotColor: "#a3ff00", activeOpacity: 0 },
    "2026-03-23": { selected: true, selectedColor: "#a3ff00", selectedTextColor: "#000" },
  };

  // 中文月份映射
  const chineseMonths = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  // 中文星期几
  const chineseDayNames = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <View style={styles.container}>
      {/* 自定义星期几头部 */}
      <View style={styles.weekDayHeader}>
        {chineseDayNames.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
      <Calendar
        customHeader={() => <></>}
        markedDates={markedDates}
        theme={calendarTheme}
        firstDay={1}
        renderHeader={(date) => {
          const monthYear = date ? `${chineseMonths[date.getMonth()]} ${date.getFullYear()}` : "";
          return <Text style={styles.headerText}>{monthYear}</Text>;
        }}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#a3ff00" }]} />
          <Text style={styles.legendText}>COMPLETED</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#ff6b6b" }]} />
          <Text style={styles.legendText}>INCOMPLETE</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#999" }]} />
          <Text style={styles.legendText}>PENDING</Text>
        </View>
      </View>
    </View>
  );
}

const calendarTheme = {
  backgroundColor: "#151718",
  calendarBackground: "#151718",
  textSectionTitleColor: "#fff",
  selectedDayBackgroundColor: "#a3ff00",
  selectedDayTextColor: "#000",
  todayTextColor: "#a3ff00",
  dayTextColor: "#fff",
  textDisabledColor: "#555",
  dotColor: "#a3ff00",
  selectedDotColor: "#fff",
  arrowColor: "#fff",
  monthTextColor: "#fff",
  indicatorColor: "#a3ff00",
  textDayFontWeight: "300" as const,
  textMonthFontWeight: "bold" as const,
  textDayHeaderFontWeight: "300" as const,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#151718",
    borderRadius: 16,
    overflow: "hidden",
  },
  weekDayHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#151718",
  },
  weekDayText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "300",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "300",
  },
});
