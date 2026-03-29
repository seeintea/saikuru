import type { WithViewStyle } from "@/types";
import type { ReactNode } from "react";
import { View } from "react-native";

interface CardProps extends WithViewStyle {
  children: ReactNode;
}

export function Card({ style = {}, children }: CardProps) {
  return (
    <View className={"bg-card p-6 rounded-4xl"} style={style}>
      {children}
    </View>
  );
}
