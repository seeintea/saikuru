import { FONTS } from "@/hooks/use-custom-fonts";
import { colorPlaceholder, colorPrimary } from "@/theme";
import { WithViewStyle } from "@/types";
import { useRef, useState } from "react";
import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

interface InputNumberProps extends WithViewStyle {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  inputHeight?: number;
}

export function InputSpinner({
  style = {},
  value,
  defaultValue = 1,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  inputHeight = 52,
}: InputNumberProps) {
  const inputRef = useRef<TextInput>(null);
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [inputText, setInputText] = useState<string>(String(defaultValue));

  const currentValue = value !== undefined ? value : internalValue;

  const handleDecrement = () => {
    Keyboard.dismiss();
    const newValue = Math.max(min, currentValue - step);
    if (onChange) {
      onChange(newValue);
    }
    setInternalValue(newValue);
    setInputText(String(newValue));
  };

  const handleIncrement = () => {
    Keyboard.dismiss();
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
        <Text className="text-4xl font-bold text-primary" style={{ fontFamily: FONTS.alibabaPuHui }}>
          -
        </Text>
      </Pressable>

      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => inputRef.current?.focus()}
        activeOpacity={1}
      >
        <TextInput
          ref={inputRef}
          value={inputText}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEditing}
          keyboardType="numeric"
          textAlign="center"
          placeholder={String(defaultValue)}
          placeholderTextColor={colorPlaceholder}
          selectionColor={colorPrimary}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
          className="text-4xl font-bold text-foreground bg-transparent p-0"
          style={{
            textAlign: "center",
            fontFamily: FONTS.alibabaPuHui,
            height: inputHeight,
            lineHeight: inputHeight,
          }}
        />
      </TouchableOpacity>

      <Pressable onPress={handleIncrement} className="px-6 py-2 items-center justify-center">
        <Text className="text-4xl font-bold text-primary" style={{ fontFamily: FONTS.alibabaPuHui }}>
          +
        </Text>
      </Pressable>
    </View>
  );
}
