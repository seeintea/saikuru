import { Input, TextArea } from "@/components/ui/input";
import { InputSpinner } from "@/components/ui/input-spinner";
import { Segmented } from "@/components/ui/segmented";
import { FONTS } from "@/hooks/use-custom-fonts";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Heading } from "./components/heading";

export function TabsCreate() {
  return (
    <ScrollView className={"flex-1 w-full p-6"} showsVerticalScrollIndicator={false}>
      <Heading title="基本信息" />
      <View className={"gap-4"}>
        <Text style={styles["basic-label"]}>任务名称</Text>
        <Input placeholder="例如：每日高强度训练" />
        <Text style={styles["basic-label"]}>任务描述</Text>
        <TextArea placeholder="例如：每日高强度训练" classNames={{ body: "h-24" }} />
      </View>
      <Heading title="周期设置" />
      <View className={"gap-4"}>
        <Segmented
          options={[
            { key: "day", label: "天" },
            { key: "week", label: "周" },
            { key: "month", label: "月" },
          ]}
          defaultValue="day"
          onChange={(value) => console.log("Selected:", value)}
        />
        <InputSpinner />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ["basic-label"]: {
    fontSize: 12,
    color: "#767575",
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: 600,
  },
  ["basic-textarea"]: {
    height: 96,
    justifyContent: "flex-start",
    paddingTop: 12,
  },
});
