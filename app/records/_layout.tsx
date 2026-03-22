import { Stack } from 'expo-router';

export default function RecordsLayout() {
  return (
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
      <Stack.Screen
        name="index"
        options={{
          title: '锻炼记录',
        }}
      />
    </Stack>
  );
}
