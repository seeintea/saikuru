import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#0E0E0E',
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
      <StatusBar style="light" />
    </View>
  );
}
