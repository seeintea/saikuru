import { PropsWithChildren } from "react";
import { View } from "react-native";

export function BackgroundView({ children }: PropsWithChildren) {
  return <View className={"flex-1 bg-surface-lighter"}>{children}</View>;
}
