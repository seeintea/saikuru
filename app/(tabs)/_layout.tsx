import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Target, Upload, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabBarButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

function TabBarButton({ label, icon: Icon, isActive, onPress }: TabBarButtonProps) {
  const getTabBarColor = () => {
    if (isActive) {
      return '#A3FF00';
    }
    return '#9BA1A6';
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.tab} activeOpacity={0.7}>
      <View
        style={[
          styles.activeContainer,
          {
            backgroundColor: isActive ? 'rgba(163, 255, 0, 0.15)' : 'transparent',
          },
        ]}
      >
        <Icon size={24} color={getTabBarColor()} strokeWidth={2.5} />
        <Text
          style={[styles.label, { color: getTabBarColor(), fontWeight: isActive ? '600' : '500' }]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

interface TabConfig {
  key: string;
  label: string;
  icon: LucideIcon;
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const tabBarBackgroundColor = 'rgba(38, 38, 38, 0.9)';

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
    alignItems: 'center',
  },
  tabBar: {
    marginBottom: 8,
    borderRadius: 100,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    gap: 4,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeContainer: {
    alignItems: 'center',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 36,
  },
  label: {
    fontSize: 10,
    paddingTop: 6,
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
