import type { WithViewStyle } from "@/types";
import { ReactNode } from "react";
import { type GestureResponderEvent, TouchableOpacity } from "react-native";

interface ButtonProps extends WithViewStyle {
  children: ReactNode;
  onPress: (event?: GestureResponderEvent) => void;
}

export function Button({ style = {}, children, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      className={"h-8 items-center justify-center bg-primary rounded-4xl px-4 text-sm"}
      style={style}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {children}
    </TouchableOpacity>
  );
}
