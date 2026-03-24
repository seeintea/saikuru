import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

// 简单的颜色配置
const config = {
  light: {
    backgroundColor: '#F5F6F7',
  },
  dark: {
    backgroundColor: '#0E0E0E',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: config[colorScheme!].backgroundColor,
      }}
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#151718',
          },
          headerTintColor: '#A3FF00',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="records"
          options={{
            title: '打卡记录',
            headerShown: true,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
