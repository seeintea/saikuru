import { Button } from "@/components/ui/button";
import type { WithViewStyle } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCheck, ChevronDown, Sprout } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Header({ style = {} }: WithViewStyle) {
  const taskLabelColor = "#c6ff00";
  const btnLabelColor = "#485e00";

  return (
    <View style={styles.container}>
      <View style={[styles.head, style]}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.task}>
            <Sprout size={18} color={taskLabelColor} />
            <Text style={[styles["task-label"], { color: taskLabelColor }]}>2026打卡</Text>
            <ChevronDown size={18} color={taskLabelColor} />
          </View>
        </TouchableOpacity>
        <Button onPress={() => {}}>
          <View style={styles.button}>
            <CheckCheck size={16} color={btnLabelColor} />
            <Text style={[styles["button-label"], { color: btnLabelColor }]}>立即打卡</Text>
          </View>
        </Button>
      </View>
      <LinearGradient
        colors={["rgba(198, 255, 0, 0.12)", "rgba(198, 255, 0, 0.04)", "rgba(198, 255, 0, 0)"]}
        style={styles.shadow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBlock: 12,
    backgroundColor: "#0e0e0e",
    zIndex: 1,
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ["task-label"]: {
    fontSize: 22,
    fontWeight: 600,
  },
  button: {
    color: "#485e00",
    fontWeight: 600,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  ["button-label"]: {
    color: "#485e00",
    fontWeight: "600",
    fontSize: 14,
  },
  shadow: {
    position: "absolute",
    bottom: -35,
    left: 0,
    right: 0,
    height: 50,
    pointerEvents: "none",
  },
});
