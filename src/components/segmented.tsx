import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import { Pressable, Text, View } from "react-native";

interface SegmentedOption {
  label: string;
  value: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedOption[];
  disabled?: boolean;
}

export function Segmented<T extends string>({
  value,
  onValueChange,
  options,
  disabled,
}: SegmentedProps<T>) {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) onValueChange(nextValue as T);
      }}
      disabled={disabled}
      className="flex-row rounded-2xl bg-surface-light dark:bg-surface-dark p-1"
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <ToggleGroupPrimitive.Item key={option.value} value={option.value} asChild>
            <Pressable
              className={`flex-1 items-center justify-center rounded-xl px-3 py-2 ${
                selected ? "bg-primary-light dark:bg-primary-dark" : "bg-transparent"
              }`}
            >
              <View>
                <Text
                  className={`text-sm font-medium ${
                    selected
                      ? "text-surface-lightest dark:text-text-primary"
                      : "text-text-secondary dark:text-text-secondary"
                  }`}
                >
                  {option.label}
                </Text>
              </View>
            </Pressable>
          </ToggleGroupPrimitive.Item>
        );
      })}
    </ToggleGroupPrimitive.Root>
  );
}
