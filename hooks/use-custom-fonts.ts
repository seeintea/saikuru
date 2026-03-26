import { useFonts } from "expo-font";

export const FONTS = {
  dingTalkJinBuTi: "DingTalkJinBuTi",
  alimamaAgile: "AlimamaAgile",
  alibabaPuHui: "AlibabaPuHui",
} as const;

export type FontFamily = (typeof FONTS)[keyof typeof FONTS];

export function useCustomFonts() {
  const [fontsLoaded, fontError] = useFonts({
    [FONTS.dingTalkJinBuTi]: require("../assets/fonts/DingTalkJinBuTi.ttf"),
    [FONTS.alimamaAgile]: require("../assets/fonts/AlimamaAgile.ttf"),
    [FONTS.alibabaPuHui]: require("../assets/fonts/AlibabaPuHuiTi3.ttf"),
  });

  return {
    fontsLoaded,
    fontError,
  };
}
