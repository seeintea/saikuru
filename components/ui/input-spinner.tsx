import { FONTS } from "@/hooks/use-custom-fonts";
import { WithViewStyle } from "@/types";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface InputNumberProps extends WithViewStyle {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function InputSpinner({
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
    <View style={style} className="flex-row bg-card rounded-full p-2 items-center justify-between">
      <Pressable onPress={handleDecrement} className="px-6 py-2 items-center justify-center">
        <Text className={"text-4xl font-bold text-primary"} style={{ fontFamily: FONTS.alibabaPuHui }}>
          -
        </Text>
      </Pressable>

      <View className={"flex-1 items-center justify-center"}>
        <TextInput
          value={inputText}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEditing}
          keyboardType="numeric"
          textAlign="center"
          placeholder={String(defaultValue)}
          placeholderTextColor="#666666"
          selectionColor="#a3ff00"
          underlineColorAndroid="transparent"
          textAlignVertical="center"
          className={"text-4xl font-bold text-white bg-transparent"}
          style={{ textAlign: "center", fontFamily: FONTS.alibabaPuHui }}
        />
      </View>

      <Pressable onPress={handleIncrement} className="px-6 py-2 items-center justify-center">
        <Text className={"text-4xl font-bold text-primary"} style={{ fontFamily: FONTS.alibabaPuHui }}>
          +
        </Text>
      </Pressable>
    </View>
  );
}
