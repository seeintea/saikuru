import { useTheme } from "@/hooks/use-theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { type LucideIcon, Plus, SquareLibrary, Target, UserRound } from "lucide-react-native";
import { useState } from "react";
import { LayoutChangeEvent, Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const tabs = [
  { key: "index", label: "周期", icon: Target },
  { key: "record", label: "记录", icon: SquareLibrary },
  { key: "mine", label: "我的", icon: UserRound },
];

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      {tabs.map((tab) => (
        <Tabs.Screen key={tab.key} name={tab.key} />
      ))}
    </Tabs>
  );
}

interface TabRect {
  x: number;
  width: number;
  height: number;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { color } = useTheme();
  const [tabRect, setTabRect] = useState<TabRect[]>([]);
  const activeIndex = useSharedValue(state.index);
  const isFirstLoad = useSharedValue(true);

  const handleTabPress = (index: number, key: string) => {
    activeIndex.value = index;
    isFirstLoad.value = false;
    navigation.navigate(key);
  };

  const handleTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { width, x, height } = event.nativeEvent.layout;
    setTabRect((prev: TabRect[]) => {
      const newRect = [...prev];
      newRect[index] = { width, x, height };
      if (newRect.filter(Boolean).length === tabs.length) {
        setTimeout(() => {
          isFirstLoad.value = false;
        }, 0);
      }
      return newRect;
    });
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const currentMeasurement = tabRect[activeIndex.value];
    if (!currentMeasurement) {
      return {
        transform: [{ translateX: 0 }],
        width: 0,
        height: 0,
      };
    }

    // | 8px | icon1 | icon2 | icon3 | 8px |
    // Animated.View top -> 3px left -> 4px
    let t = currentMeasurement.x - 4;
    let w = currentMeasurement.width + 8;
    let h = currentMeasurement.height - 6;

    // 首次加载时直接设置位置，不使用动画
    if (isFirstLoad.value) {
      return {
        transform: [{ translateX: t }],
        width: w,
        height: h,
      };
    }

    const springConf = { damping: 55, stiffness: 500 };
    const translateX = withSpring(t, springConf);
    const width = withSpring(w, springConf);
    const height = withSpring(h, springConf);

    return {
      transform: [{ translateX }],
      width,
      height,
    };
  });

  return (
    <View className={"absolute bottom-3 left-0 right-0 items-center"}>
      <View className={"flex-row gap-3"}>
        <View className={"flex-row bg-surface-lightest rounded-4xl px-2"}>
          <Animated.View
            className={"absolute top-0.75 left-0 rounded-full bg-surface-light"}
            style={indicatorStyle}
          />
          {tabs.map((tab, index) => {
            const isActive = state.routes[state.index].name === tab.key;
            return (
              <View key={tab.key} onLayout={(event) => handleTabLayout(index, event)}>
                <TabBarButton
                  label={tab.label}
                  icon={tab.icon}
                  isActive={isActive}
                  onPress={() => handleTabPress(index, tab.key)}
                />
              </View>
            );
          })}
        </View>
        <Pressable
          className={
            "rounded-full w-15.5 items-center justify-center bg-surface-lightest my-0.5 active:bg-surface-light"
          }
          onPress={() => navigation.navigate("create")}
        >
          {({ pressed }) => (
            <Plus size={32} strokeWidth={1.5} color={pressed ? color.textPrimary : color.textTertiary} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

interface TabButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

function TabBarButton({ label, icon: Icon, isActive, onPress }: TabButtonProps) {
  const { color } = useTheme();

  const activeCtxColor = isActive ? color.textPrimary : color.textTertiary;
  const activeCtxWeight = isActive ? "600" : "500";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={"items-center gap-[1.5px] z-10 px-9 py-3"}
    >
      <Icon size={20} color={activeCtxColor} strokeWidth={2.5} />
      <Text className={"text-[10px]"} style={[{ color: activeCtxColor, fontWeight: activeCtxWeight }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
