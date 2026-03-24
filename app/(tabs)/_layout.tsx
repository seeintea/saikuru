import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { LayersPlus, type LucideIcon, Target, User } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const tabs = [
  { key: 'index', label: '周期', icon: Target },
  { key: 'create', label: '新建', icon: LayersPlus },
  { key: 'mine', label: '我的', icon: User },
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

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeIndex = useSharedValue(state.index);
  const [tabMeasurements, setTabMeasurements] = useState<{ width: number; x: number }[]>([]);
  const tabRefs = useRef<(View | null)[]>([]);
  const isUserTriggered = useRef(false);
  const prevIndex = useRef(state.index);

  const handleTabPress = (index: number, key: string) => {
    isUserTriggered.current = true;
    activeIndex.value = index;
    navigation.navigate(key);
  };

  const handleTabLayout = (index: number, event: any) => {
    const { width, x } = event.nativeEvent.layout;
    setTabMeasurements((prev: { width: number; x: number }[]) => {
      const newMeasurements = [...prev];
      newMeasurements[index] = { width, x };
      return newMeasurements;
    });
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const currentMeasurement = tabMeasurements[activeIndex.value];
    if (!currentMeasurement) {
      return {
        transform: [{ translateX: 0 }],
        width: 0,
      };
    }

    // 检查是否是用户触发的切换
    const shouldAnimate = isUserTriggered.current && activeIndex.value !== prevIndex.current;

    if (shouldAnimate) {
      // 动画执行后重置标志
      isUserTriggered.current = false;
      prevIndex.current = activeIndex.value;

      const translateX = withSpring(currentMeasurement.x, {
        damping: 40,
        stiffness: 500,
      });
      const width = withSpring(currentMeasurement.width, {
        damping: 40,
        stiffness: 500,
      });

      return {
        transform: [{ translateX }],
        width,
      };
    }

    // 首次加载或非用户触发时，直接设置位置和宽度
    prevIndex.current = activeIndex.value;
    return {
      transform: [{ translateX: currentMeasurement.x }],
      width: currentMeasurement.width,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles['tab-bar']}>
        <Animated.View style={[styles['active-indicator'], indicatorStyle]} />
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
  const activeCtxColor = isActive ? '#a3ff00' : '#9ba1A6';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles['tab-item']}>
      <Icon size={24} color={activeCtxColor} strokeWidth={2.5} />
      <Text
        style={[
          styles['tab-label'],
          { color: activeCtxColor, fontWeight: isActive ? '600' : '500' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginBottom: 8,
  },
  ['tab-bar']: {
    borderRadius: 100,
    backgroundColor: 'rgba(38, 38, 38, 0.7)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingInline: 4,
    gap: 4,
    position: 'relative',
  },
  ['active-indicator']: {
    position: 'absolute',
    top: 4,
    left: 0,
    borderRadius: 100,
    backgroundColor: 'rgba(163, 255, 0, 0.15)',
    height: 60,
  },
  // tab button
  ['tab-item']: {
    alignItems: 'center',
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 100,
    paddingHorizontal: 36,
    zIndex: 1,
  },
  ['tab-label']: {
    fontSize: 12,
    paddingTop: 4,
  },
});
