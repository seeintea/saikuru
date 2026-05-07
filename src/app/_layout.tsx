import "@/global.css";
import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { VariableContextProvider } from "nativewind";

export default function RootLayout() {
  const { themeVariables } = useTheme();

  return (
    <VariableContextProvider value={themeVariables}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="dark-mode" options={{ headerShown: false }} />
      </Stack>
    </VariableContextProvider>
  );
}
