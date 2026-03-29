import { useCustomFonts } from "@/hooks/use-custom-fonts";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useCustomFonts();

  return (
    <SafeAreaView style={styles.root}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="records" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#0e0e0e",
  },
});
