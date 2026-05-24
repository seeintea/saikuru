import { ComponentProps } from "react";
import { Pressable, Text } from "react-native";

type ButtonProps = ComponentProps<typeof Pressable> & {
  title: string;
};

export function Button({ title, disabled, className, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      className={`items-center justify-center rounded-3xl bg-primary px-4 py-3 active:opacity-80 ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <Text className="text-base font-semibold text-surface-lightest">{title}</Text>
    </Pressable>
  );
}
