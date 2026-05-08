import { useTheme } from "@/hooks/use-theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { ListMinus, type LucideIcon, Target, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const tabs = [
  { key: "index", label: "周期", icon: Target },
  { key: "record", label: "记录", icon: ListMinus },
  { key: "mine", label: "我的", icon: User },
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

interface TabMeasurement {
  x: number;
  width: number;
  height: number;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeIndex = useSharedValue(state.index);
  const isFirstLoad = useSharedValue(true);
  const [tabMeasurements, setTabMeasurements] = useState<TabMeasurement[]>([]);
  const tabRefs = useRef<(View | null)[]>([]);

  // 监听 state.index 变化，确保 activeIndex 与当前选中的 tab 同步
  useEffect(() => {
    activeIndex.value = state.index;
  }, [state.index]);

  const handleTabPress = (index: number, key: string) => {
    isFirstLoad.value = false; // 第一次点击后标记为非首次加载
    activeIndex.value = index;
    navigation.navigate(key);
  };

  const handleTabLayout = (index: number, event: any) => {
    const { width, x, height } = event.nativeEvent.layout;
    setTabMeasurements((prev: TabMeasurement[]) => {
      const newMeasurements = [...prev];
      newMeasurements[index] = { width, x, height };
      // 当所有 tab 都测量完成后，标记首次加载完成
      if (newMeasurements.filter(Boolean).length === tabs.length) {
        // 使用 setTimeout 确保在下次事件循环中设置，让初始位置先渲染
        setTimeout(() => {
          isFirstLoad.value = false;
        }, 0);
      }
      return newMeasurements;
    });
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const currentMeasurement = tabMeasurements[activeIndex.value];
    if (!currentMeasurement) {
      return {
        transform: [{ translateX: 0 }],
        width: 0,
        height: 0,
      };
    }

    // 首次加载时直接设置位置，不使用动画
    if (isFirstLoad.value) {
      return {
        transform: [{ translateX: currentMeasurement.x }],
        width: currentMeasurement.width,
        height: currentMeasurement.height,
      };
    }

    const springConf = { damping: 40, stiffness: 500 };
    const translateX = withSpring(currentMeasurement.x, springConf);
    const width = withSpring(currentMeasurement.width, springConf);
    const height = withSpring(currentMeasurement.height, springConf);

    return {
      transform: [{ translateX }],
      width,
      height,
    };
  });

  return (
    <View className={"absolute bottom-0 left-0 right-0 items-center mb-2"}>
      <View className={"rounded-full flex-row items-center justify-center py-1 px-1 bg-surface-lightest"}>
        <Animated.View
          className={"absolute top-1 left-0 rounded-full bg-surface-light"}
          style={indicatorStyle}
        />
        {tabs.map((tab, index) => {
          const isActive = state.routes[state.index].name === tab.key;
          return (
            <View
              key={tab.key}
              ref={(ref) => {
                tabRefs.current[index] = ref;
              }}
              onLayout={(event) => handleTabLayout(index, event)}
            >
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
    </View>
  );
}

interface TabBarButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

function TabBarButton({ label, icon: Icon, isActive, onPress }: TabBarButtonProps) {
  const { color } = useTheme();

  const activeCtxColor = isActive ? color.textPrimary : color.textTertiary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={"items-center gap-1 py-2 px-9 rounded-full z-10"}
    >
      <Icon size={24} color={activeCtxColor} strokeWidth={2.5} />
      <Text className={"text-xs"} style={[{ color: activeCtxColor, fontWeight: isActive ? "600" : "500" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
