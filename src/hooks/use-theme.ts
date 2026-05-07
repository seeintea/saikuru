import { Colors, ColorsObject, ThemeVariables } from "@/constants/theme";
import { useMemo } from "react";
import { useThemeMode } from "./use-theme-mode";

export { setThemeMode, type ThemeMode } from "./use-theme-mode";

export function useTheme() {
  const { resolvedScheme } = useThemeMode();

  return useMemo(() => {
    let color: ColorsObject = Colors.light;
    let themeVariables = ThemeVariables.light;

    if (resolvedScheme === "dark") {
      color = Colors.dark;
      themeVariables = ThemeVariables.dark;
    }

    return { color, themeVariables };
  }, [resolvedScheme]);
}
