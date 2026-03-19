import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Target, Upload, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

interface TabBarButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

function TabBarButton({ label, icon: Icon, isActive, onPress }: TabBarButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getTabBarColor = () => {
    if (isActive) {
      return '#A3FF00';
    }
    return isDark ? '#9BA1A6' : '#687076';
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.tab} activeOpacity={0.7}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isActive ? 'rgba(64, 64, 64, 0.5)' : 'transparent' },
        ]}
      >
        <Icon size={28} color={getTabBarColor()} strokeWidth={2.5} />
      </View>
      <Text
        style={[styles.label, { color: getTabBarColor(), fontWeight: isActive ? '600' : '500' }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface TabConfig {
  key: string;
  label: string;
  icon: LucideIcon;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tabBarBackgroundColor = isDark ? 'rgba(38, 38, 38, 0.9)' : 'rgba(244, 244, 245, 0.9)';

  const tabs: TabConfig[] = [
    { key: 'index', label: '摘要', icon: Target },
    { key: 'upload', label: '上传', icon: Upload },
    { key: 'self', label: '我的', icon: User },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { backgroundColor: tabBarBackgroundColor }]}>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => {
            const isActive = state.routes[state.index].name === tab.key;

            return (
              <TabBarButton
                key={tab.key}
                label={tab.label}
                icon={tab.icon}
                isActive={isActive}
                onPress={() => {
                  navigation.navigate(tab.key as never);
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  iconContainer: {
    marginBottom: 4,
    borderRadius: 9999,
    padding: 8,
  },
  label: {
    fontSize: 12,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="upload" />
      <Tabs.Screen name="self" />
    </Tabs>
  );
}
