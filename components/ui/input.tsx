import { FONTS } from "@/hooks/use-custom-fonts";
import { ViewStyleProps } from "@/types";
import { X } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  bodyStyle?: ViewStyleProps;
}

export function Input({ bodyStyle, style, placeholderTextColor, ...other }: InputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable style={[styles.container, bodyStyle]} onPress={() => inputRef.current?.focus()}>
      <View style={styles.content}>
        <TextInput
          ref={inputRef}
          style={[styles.input, style]}
          selectionColor="#a3ff00"
          placeholderTextColor={placeholderTextColor || "#6c7180"}
          underlineColorAndroid="transparent"
          {...other}
        />
        <View style={styles.closed}>
          <X color={"#ffffff"} size={16} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: "center",
    borderRadius: 36,
    paddingInline: 24,
    backgroundColor: "#131313",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  closed: {
    padding: 2,
    borderRadius: 64,
    backgroundColor: "#000",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    fontFamily: FONTS.alibabaPuHui,
    paddingVertical: 0,
  },
});
