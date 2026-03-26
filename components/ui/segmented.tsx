import { FONTS } from "@/hooks/use-custom-fonts";
import { WithViewStyle } from "@/types";
import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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
  const [buttonWidth, setButtonWidth] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const translateX = useSharedValue(0);

  // 计算选中按钮的位置
  const getSelectedIndex = () => options.findIndex(option => option.key === selectedKey);

  // 更新动画位置
  const updateTranslateX = () => {
    const selectedIndex = getSelectedIndex();
    translateX.value = withSpring(selectedIndex * buttonWidth);
  };

  // 测量按钮宽度
  const handleButtonLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setButtonWidth(width);
  };

  // 测量容器宽度
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  // 初始化动画位置
  useEffect(() => {
    if (buttonWidth > 0) {
      updateTranslateX();
    }
  }, [buttonWidth]);

  // 当选中值变化时更新动画
  useEffect(() => {
    updateTranslateX();
  }, [selectedKey]);

  const handlePress = (key: string) => {
    setSelectedKey(key);
    onChange(key);
  };

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: buttonWidth > 0 ? buttonWidth : "100%",
    };
  });

  return (
    <View style={[styles.container, style]} onLayout={handleContainerLayout}>
      {/* 滑动的选中背景 */}
      <Animated.View style={[styles.activeBackground, animatedStyle]} />

      {options.map((option, index) => {
        const isSelected = selectedKey === option.key;

        return (
          <Pressable
            key={option.key}
            style={styles.button}
            onLayout={index === 0 ? handleButtonLayout : undefined}
            onPress={() => handlePress(option.key)}
          >
            <Text style={[styles.text, isSelected ? styles["selected-text"] : styles["unselected-text"]]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 32,
    padding: 4,
    alignItems: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBackground: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 32,
    backgroundColor: "#a3ff00",
  },
  text: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: FONTS.alibabaPuHui,
    zIndex: 1,
  },
  ["selected-text"]: {
    color: "#000000",
  },
  ["unselected-text"]: {
    color: "#888888",
  },
});
