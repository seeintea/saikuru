import { Colors, type ColorsObject } from "@/constants/theme";
import { useThemeMode } from "./useThemeMode";

export { type ThemeMode, setThemeMode } from "./useThemeMode";

export function useTheme() {
  const { resolvedScheme } = useThemeMode();
  return (resolvedScheme === "dark" ? Colors.dark : Colors.light) as ColorsObject;
}
