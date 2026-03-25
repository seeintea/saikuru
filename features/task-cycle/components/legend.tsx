import { StyleSheet, Text, View } from "react-native";
import { STATUS_COLORS } from "@/features/task-cycle/constants";

interface LegendProps {
  style?: any;
}

const LegendItem = ({ status, color, label }: { status: string; color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.statusDot, { backgroundColor: color }]} />
    <Text style={styles.label}>{label}</Text>
  </View>
);

export default function Legend({ style }: LegendProps) {
  return (
    <View style={[styles.container, style]}>
      <LegendItem status="completed" color={STATUS_COLORS.completed} label="已完成" />
      <LegendItem status="missed" color={STATUS_COLORS.missed} label="未完成" />
      <LegendItem status="pending" color={STATUS_COLORS.pending} label="待记录" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3D3D3D",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    color: "#9BA1A6",
    fontSize: 14,
  },
});
