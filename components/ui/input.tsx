import { FONTS } from "@/hooks/use-custom-fonts";
import { colorBackground, colorPlaceholder, colorPrimary } from "@/theme";
import { cn } from "@/utils/cn";
import { X } from "lucide-react-native";
import { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View, type TextInputProps } from "react-native";

interface BaseInputProps extends TextInputProps {
  classNames?: {
    body?: string;
    input?: string;
  };
  isMultiline?: boolean;
  numberOfLines?: number;
}

interface CommonInputProps extends TextInputProps {
  classNames?: {
    body?: string;
    input?: string;
  };
}

function BaseInput({
  classNames,
  placeholderTextColor,
  value: controlledValue,
  onChangeText: controlledOnChangeText,
  isMultiline = false,
  numberOfLines = 1,
  ...other
}: BaseInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [localValue, setLocalValue] = useState("");

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : localValue;

  const handleChangeText = (text: string) => {
    if (isControlled) {
      controlledOnChangeText?.(text);
    } else {
      setLocalValue(text);
    }
  };

  const handleClear = () => {
    inputRef.current?.focus();
    handleChangeText("");
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      className={cn(
        "flex-row items-center justify-center px-4 py-3 border border-input",
        isMultiline ? "items-start rounded-3xl" : "items-center rounded-4xl",
        classNames?.body
      )}
    >
      <TextInput
        ref={inputRef}
        className={cn("flex-1 text-base text-foreground p-0", classNames?.input)}
        style={[{ fontFamily: FONTS.alibabaPuHui }]}
        selectionColor={colorPrimary}
        placeholderTextColor={placeholderTextColor || colorPlaceholder}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={handleChangeText}
        multiline={isMultiline}
        numberOfLines={isMultiline ? numberOfLines : 1}
        textAlignVertical={isMultiline ? "top" : "center"}
        {...other}
      />
      {value ? (
        <View className="ml-3 relative">
          <View className={cn("p-0.5 bg-card rounded-full", isMultiline ? "mt-0.5" : "")}>
            <X color={colorBackground} size={14} />
          </View>
          <TouchableOpacity
            onPressIn={handleClear}
            activeOpacity={1}
            className="absolute w-12 h-12 z-50 -mt-3.5 -ml-3"
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

interface InputProps extends CommonInputProps {}

export function Input({ classNames, placeholderTextColor, value, onChangeText, ...other }: InputProps) {
  return (
    <BaseInput
      classNames={classNames}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      isMultiline={false}
      numberOfLines={1}
      {...other}
    />
  );
}

interface TextAreaProps extends CommonInputProps {
  numberOfLines?: number;
}

export function TextArea({
  classNames,
  placeholderTextColor,
  value,
  onChangeText,
  numberOfLines = 3,
  ...other
}: TextAreaProps) {
  return (
    <BaseInput
      classNames={classNames}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      isMultiline={true}
      numberOfLines={numberOfLines}
      {...other}
    />
  );
}
