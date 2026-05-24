import { useThemeMode } from "@/hooks/use-theme-mode";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function DarkMode() {
  const { mode } = useThemeMode();
  const router = useRouter();

  const currentText = mode === "system" ? "跟随系统" : mode === "dark" ? "已开启" : "已关闭";

  const handleToggle = () => {
    router.push("/dark-mode");
  };

  return (
    <Pressable className="flex flex-row items-center justify-between" onPress={handleToggle}>
      <Text className="font-bold text-text-primary">深色模式</Text>
      <View className="flex flex-row items-center">
        <Text className={"text-text-primary"}>{currentText}</Text>
        <ChevronRight />
      </View>
    </Pressable>
  );
}
