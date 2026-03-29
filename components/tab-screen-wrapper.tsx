import type { WithViewStyle } from "@/types";
import type { ReactNode } from "react";
import { View } from "react-native";

export const tabPaddingBottom = 84;

interface TabScreenWrapperProps extends WithViewStyle {
  children: ReactNode;
}

export function TabScreenWrapper({ children, style = {} }: TabScreenWrapperProps) {
  return (
    <View className={"bg-background flex-1"} style={[{ paddingBottom: tabPaddingBottom }, , style]}>
      {children}
    </View>
  );
}
