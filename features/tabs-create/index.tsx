import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FONTS } from "@/hooks/use-custom-fonts";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Heading } from "./components/heading";

export function TabsCreate() {
  return (
    <ScrollView style={{ flex: 1, width: "100%", padding: 24 }}>
      <Heading title="基本信息" />
      <View style={styles.basic}>
        <Text style={styles["basic-label"]}>任务名称</Text>
        <Input placeholder="例如：每日高强度训练" />
        <Text style={styles["basic-label"]}>任务描述</Text>
        <Input
          placeholder="例如：每日高强度训练"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles["basic-textarea"]}
        />
      </View>
      <Heading title="周期设置" />
      <Card>
        <View>
          <Text>111</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  basic: {
    gap: 12,
  },
  ["basic-label"]: {
    fontSize: 12,
    color: "#767575",
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: 600,
  },
  ["basic-textarea"]: {
    height: "auto",
  },
});
