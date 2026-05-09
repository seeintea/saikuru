import { Switch } from "@/components/switch";
import { useTheme } from "@/hooks/use-theme";
import { useThemeMode } from "@/hooks/use-theme-mode";
import { Check } from "lucide-react-native";
import { useCallback } from "react";
import { PixelRatio, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const borderWidth = (1 / PixelRatio.get()) * 1.5;

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
      <View
        className="flex-row items-center justify-between bg-surface-lightest px-4 py-3 border-border"
        style={{ borderTopWidth: borderWidth, borderBottomWidth: borderWidth }}
      >
        <View>
          <Text className={"text-text-primary text-lg"}>跟随系统</Text>
          <Text className={"text-text-secondary text-sm"}>开启后将跟随系统打开或关闭深色模式</Text>
        </View>
        <Switch checked={mode === "system"} onCheckedChange={handleToggle} />
      </View>
      {mode !== "system" && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text className={"text-text-primary p-4"}>手动选择</Text>
          <Pressable
            className="flex-row items-center justify-between bg-surface-lightest px-4 py-3 border-border"
            style={{ borderTopWidth: borderWidth, borderBottomWidth: borderWidth }}
            onPress={() => setThemeMode("light")}
          >
            <Text className={"text-text-primary"}>普通模式</Text>
            {mode === "light" && <Check size={18} color={color.primaryDark} />}
          </Pressable>
          <Pressable
            className="flex-row items-center justify-between bg-surface-lightest px-4 py-3 border-border"
            style={{ borderBottomWidth: borderWidth }}
            onPress={() => setThemeMode("dark")}
          >
            <Text className={"text-text-primary"}>深色模式</Text>
            {mode === "dark" && <Check size={18} color={color.primaryDark} />}
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
