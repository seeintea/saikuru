import { useTheme } from "@/hooks/use-theme";
import { Minus, Plus } from "lucide-react-native";
import type { TextInputProps } from "react-native";
import { Pressable, TextInput, View } from "react-native";

type InputNumberProps = Pick<TextInputProps, "onBlur" | "placeholder"> & {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  step?: number;
  min?: number;
};

export function InputNumber({ value, onValueChange, step = 1, min, onBlur, placeholder }: InputNumberProps) {
  const { color } = useTheme();
  const decreaseDisabled = min != null && (value ?? 0) <= min;

  const handleChange = (nextValue: number) => {
    onValueChange(min == null ? nextValue : Math.max(min, nextValue));
  };

  return (
    <View className="flex-row items-center rounded-3xl bg-surface-light px-2">
      <Pressable
        className={`items-center justify-center rounded-full bg-surface-lightest p-1.5 active:opacity-70 ${
          decreaseDisabled ? "opacity-40" : ""
        }`}
        disabled={decreaseDisabled}
        onPress={() => handleChange((value ?? 0) - step)}
      >
        <Minus size={16} color={color.textSecondary} />
      </Pressable>
      <TextInput
        className="mx-3 flex-1 py-1.5 text-base font-medium text-text-primary"
        keyboardType="number-pad"
        onBlur={onBlur}
        onChangeText={(nextValue) => onValueChange(nextValue ? Number(nextValue) : undefined)}
        placeholder={placeholder}
        placeholderTextColor={color.textTertiary}
        textAlign="center"
        value={value == null ? "" : `${value}`}
      />
      <Pressable
        className="items-center justify-center rounded-full bg-surface-lightest p-1.5 active:opacity-70"
        onPress={() => handleChange((value ?? 0) + step)}
      >
        <Plus size={16} color={color.textSecondary} />
      </Pressable>
    </View>
  );
}
