import { FONTS } from "@/hooks/use-custom-fonts";
import { WithViewStyle } from "@/types";
import { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export interface SegmentedOption {
  key: string;
  label: string;
}

interface SegmentedProps extends WithViewStyle {
  options: SegmentedOption[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

export function Segmented({ style = {}, options, defaultValue, onChange }: SegmentedProps) {
  const [selectedKey, setSelectedKey] = useState<string>(
    defaultValue || (options.length > 0 ? options[0].key : "")
  );
  const [displayKey, setDisplayKey] = useState<string>(
    defaultValue || (options.length > 0 ? options[0].key : "")
  );
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const translateX = useSharedValue(0);
  const isFirstLoad = useSharedValue(true);

  const getSelectedIndex = () => options.findIndex((option) => option.key === selectedKey);

  const updateIndicator = () => {
    const selectedIndex = getSelectedIndex();
    const buttonWidth = containerWidth > 0 ? containerWidth / options.length : 0;
    const targetX = selectedIndex * buttonWidth;

    if (isFirstLoad.value) {
      translateX.value = targetX;
    } else {
      translateX.value = withTiming(targetX, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    }
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  useEffect(() => {
    if (containerWidth > 0) {
      updateIndicator();
      isFirstLoad.value = false;
    }
  }, [containerWidth]);

  useEffect(() => {
    if (!isFirstLoad.value && containerWidth > 0) {
      updateIndicator();
    }
  }, [selectedKey]);

  const handlePress = (key: string) => {
    if (key === selectedKey) return;
    setSelectedKey(key);
    onChange(key);
    setDisplayKey(key);
  };

  const buttonWidth = containerWidth > 0 ? containerWidth / options.length : 0;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: buttonWidth,
    };
  });

  return (
    <View className={" bg-card rounded-full p-1"}>
      <View
        className={"flex-1 flex-row items-center justify-center relative"}
        onLayout={handleContainerLayout}
        style={style}
      >
        {containerWidth > 0 && (
          <Animated.View
            className={"absolute left-0 top-0 bottom-0 bg-primary rounded-full"}
            style={[animatedStyle]}
          />
        )}
        {options.map((option) => {
          const isActive = displayKey === option.key;
          return (
            <Pressable
              key={option.key}
              className={"py-3 flex-1 items-center justify-center"}
              onPress={() => handlePress(option.key)}
            >
              <Text
                className={"text-base font-medium z-10"}
                style={{
                  fontFamily: FONTS.alibabaPuHui,
                  color: isActive ? "#000000" : "#9ba1a6",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
