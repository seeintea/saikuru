import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { useColorScheme } from "react-native";

const STORAGE_KEY = "theme_mode";

export type ThemeMode = "light" | "dark" | "system";

let currentMode: ThemeMode = "system";
const subscribers = new Set<() => void>();

function emit() {
  subscribers.forEach((cb) => cb());
}

// Restore from storage on module load
AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
  if (stored === "light" || stored === "dark" || stored === "system") {
    currentMode = stored;
    emit();
  }
});

export function setThemeMode(mode: ThemeMode) {
  currentMode = mode;
  emit();
  AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot() {
  return currentMode;
}

export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot);
  const systemScheme = useColorScheme();

  const resolvedScheme: "light" | "dark" =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  return { mode, resolvedScheme, setThemeMode };
}
