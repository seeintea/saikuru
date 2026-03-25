import { Stack } from "expo-router";

export default function RecordsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 隐藏这个 Stack 的 header，避免双重导航
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
