import { Button } from "@/components/ui/button";
import { FONTS } from "@/hooks/use-custom-fonts";
import { colorPrimary, colorPrimaryForeground } from "@/theme";
import type { WithViewStyle } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCheck, ChevronDown } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export function Header({ style = {} }: WithViewStyle) {
  return (
    <View className={"relative"}>
      <View className={"flex-row items-center justify-between py-3 bg-background z-10"} style={style}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className={"flex-row items-center gap-2"}>
            <Text className={"text-xl"} style={{ color: colorPrimary, fontFamily: FONTS.dingTalkJinBuTi }}>
              2026打卡
            </Text>
            <ChevronDown size={18} color={colorPrimary} />
          </View>
        </TouchableOpacity>
        <Button onPress={() => {}}>
          <View className={"font-bold flex-row items-center gap-1"}>
            <CheckCheck size={16} color={colorPrimaryForeground} />
            <Text className={"font-bold text-sm"} style={{ color: colorPrimaryForeground }}>
              立即打卡
            </Text>
          </View>
        </Button>
      </View>
      <LinearGradient
        colors={["rgba(198, 255, 0, 0.12)", "rgba(198, 255, 0, 0.04)", "rgba(198, 255, 0, 0)"]}
        className={"absolute left-0 right-0 h-12 pointer-events-none -bottom-8"}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}
