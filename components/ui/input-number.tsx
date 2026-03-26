import { FONTS } from "@/hooks/use-custom-fonts";
import { WithViewStyle } from "@/types";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface InputNumberProps extends WithViewStyle {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const webStyle = Platform.select({
  web: { outline: "none" },
  default: undefined,
});

export function InputNumber({
  style = {},
  value,
  defaultValue = 1,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
}: InputNumberProps) {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [inputText, setInputText] = useState<string>(String(defaultValue));

  const currentValue = value !== undefined ? value : internalValue;

  const handleDecrement = () => {
    const newValue = Math.max(min, currentValue - step);
    if (onChange) {
      onChange(newValue);
    }
    setInternalValue(newValue);
    setInputText(String(newValue));
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, currentValue + step);
    if (onChange) {
      onChange(newValue);
    }
    setInternalValue(newValue);
    setInputText(String(newValue));
  };

  const handleChangeText = (text: string) => {
    setInputText(text);
  };

  const handleEndEditing = () => {
    let numValue = Number(inputText);

    if (isNaN(numValue)) {
      numValue = currentValue;
    }

    const newValue = Math.max(min, Math.min(max, numValue));

    if (onChange) {
      onChange(newValue);
    }
    setInternalValue(newValue);
    setInputText(String(newValue));
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.button} onPress={handleDecrement}>
        <Text style={styles["button-text"]}>−</Text>
      </Pressable>

      <View style={styles["input-container"]}>
        <TextInput
          style={[styles.input, webStyle]}
          value={inputText}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEditing}
          keyboardType="numeric"
          textAlign="center"
          placeholder={String(defaultValue)}
          placeholderTextColor="#666666"
          selectionColor="#A3FF00"
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
      </View>

      <Pressable style={styles.button} onPress={handleIncrement}>
        <Text style={styles["button-text"]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 32,
    padding: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  ["button-text"]: {
    fontSize: 32,
    fontWeight: "300",
    color: "#A3FF00",
    fontFamily: FONTS.alibabaPuHui,
    lineHeight: 36,
  },
  ["input-container"]: {
    flex: 1,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 32,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: FONTS.alibabaPuHui,
    textAlign: "center",
    height: "auto",
    minHeight: 36,
    backgroundColor: "transparent",
    width: "100%",
    alignSelf: "center",
    ...Platform.select({
      android: {
        textAlignVertical: "center",
        paddingVertical: 0,
        paddingHorizontal: 0,
      },
    }),
  },
});
