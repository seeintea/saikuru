import { StyleSheet, Text } from "react-native";

export function TabsMine() {
  return <Text style={styles.title}>我的</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: "#A3FF00",
    fontSize: 24,
    fontWeight: "bold",
  },
});
