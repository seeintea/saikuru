import { TabScreenWrapper } from "@/components/tab-screen-wrapper";
import { TabsMine } from "@/features/tabs-mine";
import { StyleSheet } from "react-native";

export default function MineScreen() {
  return (
    <TabScreenWrapper style={styles.container}>
      <TabsMine />
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
