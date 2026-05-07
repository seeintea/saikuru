import { Switch } from "@/components/switch";
import { useTheme } from "@/hooks/use-theme";
import { useThemeMode } from "@/hooks/use-theme-mode";
import { Check } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function DarkMode() {
  const { mode, resolvedScheme, setThemeMode } = useThemeMode();
  const { color } = useTheme();

  const handleToggle = useCallback(
    (checked: boolean) => {
      setThemeMode(checked ? "system" : resolvedScheme);
    },
    [resolvedScheme, setThemeMode]
  );

  return (
    <View className={"flex-1"}>
      <View className="flex-row items-center justify-between bg-secondary px-4 py-3 border-t border-b border-border">
        <View>
          <Text className={"text-foreground text-lg"}>跟随系统</Text>
          <Text className={"text-secondary-foreground text-sm"}>开启后将跟随系统打开或关闭深色模式</Text>
        </View>
        <Switch checked={mode === "system"} onCheckedChange={handleToggle} />
      </View>
      {mode !== "system" && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text className={"text-foreground p-4"}>手动选择</Text>
          <Pressable
            className="flex-row items-center justify-between bg-secondary p-4 border-t border-b border-border"
            onPress={() => setThemeMode("light")}
          >
            <Text className={"text-foreground"}>普通模式</Text>
            {mode === "light" && <Check size={18} color={color.primary} />}
          </Pressable>
          <Pressable
            className="flex-row items-center justify-between bg-secondary p-4 border-b border-border"
            onPress={() => setThemeMode("dark")}
          >
            <Text className={"text-foreground"}>深色模式</Text>
            {mode === "dark" && <Check size={18} color={color.primary} />}
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
