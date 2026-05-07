import { Header } from "@/components/header";
import { DarkMode } from "@/features/dark-mode";
import { View } from "react-native";

export default function DarkModeScreen() {
  return (
    <View className={"flex-1 bg-background"}>
      <Header title="深色模式" />
      <DarkMode />
    </View>
  );
}
