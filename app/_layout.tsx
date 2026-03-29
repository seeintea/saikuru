import { useCustomFonts } from "@/hooks/use-custom-fonts";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import { SafeAreaView } from "react-native-safe-area-context";

import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useCustomFonts();

  setBackgroundColorAsync("#141414");

  return (
    <SafeAreaView className={"flex-1 w-full bg-background"} style={{ height: "100%" }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="records" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
