import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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

interface OptionRect {
  x: number;
  width: number;
  height: number;
}

export function Segmented<T extends string>({
  value,
  onValueChange,
  options,
  disabled,
}: SegmentedProps<T>) {
  const [optionRects, setOptionRects] = useState<OptionRect[]>([]);
  const activeIndex = useSharedValue(Math.max(options.findIndex((option) => option.value === value), 0));
  const isFirstLoad = useSharedValue(true);

  useEffect(() => {
    activeIndex.value = Math.max(options.findIndex((option) => option.value === value), 0);
  }, [activeIndex, options, value]);

  const handleOptionLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width, height } = event.nativeEvent.layout;
    setOptionRects((prev) => {
      const next = [...prev];
      next[index] = { x, width, height };
      if (next.filter(Boolean).length === options.length) {
        setTimeout(() => {
          isFirstLoad.value = false;
        }, 0);
      }
      return next;
    });
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const currentRect = optionRects[activeIndex.value];
    if (!currentRect) {
      return { transform: [{ translateX: 0 }], width: 0, height: 0 };
    }

    if (isFirstLoad.value) {
      return {
        transform: [{ translateX: currentRect.x }],
        width: currentRect.width,
        height: currentRect.height,
      };
    }

    const springConfig = { damping: 70, stiffness: 650 };
    return {
      transform: [{ translateX: withSpring(currentRect.x, springConfig) }],
      width: withSpring(currentRect.width, springConfig),
      height: withSpring(currentRect.height, springConfig),
    };
  });

  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) onValueChange(nextValue as T);
      }}
      disabled={disabled}
      className="relative flex-row rounded-3xl bg-surface-light p-1"
    >
      <Animated.View className="absolute left-0 top-1 rounded-3xl bg-primary" style={indicatorStyle} />
      {options.map((option, index) => {
        const selected = option.value === value;

        return (
          <View key={option.value} className="flex-1" onLayout={(event) => handleOptionLayout(index, event)}>
            <ToggleGroupPrimitive.Item value={option.value} asChild>
              <Pressable className="z-10 items-center justify-center rounded-2xl px-3 py-2">
                <Text
                  className={`text-base font-medium ${
                    selected ? "text-surface-lightest" : "text-text-secondary"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            </ToggleGroupPrimitive.Item>
          </View>
        );
      })}
    </ToggleGroupPrimitive.Root>
  );
}
