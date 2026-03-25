import { useFonts } from "expo-font";

export const FONTS = {
  dingTalkJinBuTi: "DingTalkJinBuTi",
  alimamaAgile: "AlimamaAgile",
} as const;

export type FontFamily = (typeof FONTS)[keyof typeof FONTS];

export function useCustomFonts() {
  const [fontsLoaded, fontError] = useFonts({
    [FONTS.dingTalkJinBuTi]: require("../assets/fonts/DingTalkJinBuTi.ttf"),
    [FONTS.alimamaAgile]: require("../assets/fonts/AlimamaAgile.ttf"),
  });

  return {
    fontsLoaded,
    fontError,
  };
}
