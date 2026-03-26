import { FONTS } from "@/hooks/use-custom-fonts";
import { WithViewStyle } from "@/types";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeadingProps extends WithViewStyle {
  title: string;
  extra?: ReactNode;
}

export function Heading({ title, style, extra }: HeadingProps) {
  return (
    <View style={[styles.heading, style]}>
      <View style={styles["heading-content"]}>
        <View style={styles.block} />
        <Text style={styles.label}>{title}</Text>
      </View>
      {extra && <View>{extra}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  ["heading-content"]: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  block: {
    width: 4,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#c6ff00",
  },
  label: {
    color: "#c6ff00",
    fontSize: 18,
    fontFamily: FONTS.alibabaPuHui,
    fontWeight: 600,
  },
});
