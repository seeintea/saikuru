import { FONTS } from "@/hooks/use-custom-fonts";
import { ViewStyleProps } from "@/types";
import { useRef } from "react";
import { Platform, Pressable, StyleSheet, TextInput, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  bodyStyle?: ViewStyleProps;
}

const webStyle = Platform.select({
  web: { outline: "none" },
  default: undefined,
});

export function Input({ bodyStyle, style, placeholderTextColor, ...other }: InputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable style={[styles.container, bodyStyle]} onPress={() => inputRef.current?.focus()}>
      <TextInput
        ref={inputRef}
        style={[styles.input, webStyle, style]}
        selectionColor="#A3FF00"
        placeholderTextColor={placeholderTextColor || "#6c7180"}
        underlineColorAndroid="transparent"
        textAlignVertical="center"
        {...other}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    paddingInline: 24,
    paddingBlock: 18,
    backgroundColor: "#131313",
  },
  input: {
    height: Platform.select({
      web: 16,
      android: 38, // todo fix
      ios: 16,
    }),
    fontSize: 16,
    color: "#ffffff",
    fontFamily: FONTS.alibabaPuHui,
    ...Platform.select({
      android: {
        textAlignVertical: "center",
      },
    }),
  },
});
