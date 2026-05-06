import { Switch } from "@/components/switch";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Check } from "lucide-react-native";
import { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function DarkMode() {
  const { mode, resolvedScheme, setThemeMode } = useThemeMode();

  const handleToggle = useCallback(
    (checked: boolean) => {
      setThemeMode(checked ? "system" : resolvedScheme);
    },
    [resolvedScheme, setThemeMode]
  );

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View>
          <Text>跟随系统</Text>
          <Text>开启后将跟随系统打开或关闭深色模式</Text>
        </View>
        <Switch checked={mode === "system"} onCheckedChange={handleToggle} />
      </View>
      {mode !== "system" && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text>手动选择</Text>
          <Pressable className="flex-row items-center justify-between" onPress={() => setThemeMode("light")}>
            <Text>普通模式</Text>
            {mode === "light" && <Check />}
          </Pressable>
          <Pressable className="flex-row items-center justify-between" onPress={() => setThemeMode("dark")}>
            <Text>深色模式</Text>
            {mode === "dark" && <Check />}
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
