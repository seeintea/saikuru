import { useTheme } from "@/hooks/use-theme";
import { X } from "lucide-react-native";
import { ComponentProps, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

type InputProps = ComponentProps<typeof TextInput>;

export function Input({ onBlur, onFocus, onChangeText, value, ...props }: InputProps) {
  const { color } = useTheme();
  const [focused, setFocused] = useState(false);
  const showClear = focused && !!value;

  return (
    <View className="flex-row items-center rounded-3xl bg-surface-light px-4">
      <TextInput
        {...props}
        className="flex-1 py-3 text-base text-text-primary"
        placeholderTextColor={color.textTertiary}
        value={value}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onChangeText={onChangeText}
      />
      {showClear ? (
        <Pressable className="ml-2 rounded-full bg-surface-dark/20 p-1" onPressIn={() => onChangeText?.("")}>
          <X size={14} color={color.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}
