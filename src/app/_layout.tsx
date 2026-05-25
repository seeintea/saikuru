import "@/global.css";
import { useFonts } from "@/hooks/use-fonts";
import { useTheme } from "@/hooks/use-theme";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { VariableContextProvider } from "nativewind";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useFonts();
  const { themeVariables } = useTheme();

  return (
    <VariableContextProvider value={themeVariables}>
      <View className={"flex-1 bg-surface-lighter"}>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              animation: "slide_from_right",
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="dark-mode" options={{ headerShown: false }} />
            <Stack.Screen name="create" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
        <PortalHost />
      </View>
    </VariableContextProvider>
  );
}
