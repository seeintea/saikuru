import "@/global.css";
import { useFonts } from "@/hooks/use-fonts";
import { useTheme } from "@/hooks/use-theme";
import { PortalHost } from "@rn-primitives/portal";
import { initDatabase } from "@server/db/connection";
import { Stack } from "expo-router";
import { VariableContextProvider } from "nativewind";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useFonts();
  const { themeVariables } = useTheme();
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    initDatabase()
      .then(() => {
        if (isMounted) setIsDbReady(true);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) setDbError(error instanceof Error ? error : new Error("数据库初始化失败"));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <VariableContextProvider value={themeVariables}>
      <View className={"flex-1 bg-surface-lighter"}>
        <SafeAreaView style={{ flex: 1 }}>
          {dbError ? (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-center text-base font-medium text-error">数据库初始化失败</Text>
              <Text className="mt-2 text-center text-sm text-text-secondary">{dbError.message}</Text>
            </View>
          ) : isDbReady ? (
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
          ) : null}
        </SafeAreaView>
        <PortalHost />
      </View>
    </VariableContextProvider>
  );
}
