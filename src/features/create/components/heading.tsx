import { FONTS } from "@/hooks/use-fonts";
import { ReactNode } from "react";
import { Text, View } from "react-native";

interface HeadingProps {
  title: string;
  extra?: ReactNode;
}

export function Heading({ title, extra }: HeadingProps) {
  return (
    <View className={"w-full items-center justify-between flex-row"}>
      <View className={"flex-row items-center gap-2"}>
        <View className={"w-1 h-5 rounded bg-primary-dark"} />
        <Text
          className={"font-semibold text-lg color-primary-dark"}
          style={{ fontFamily: FONTS.alibabaPuHui }}
        >
          {title}
        </Text>
      </View>
      {extra && <View>{extra}</View>}
    </View>
  );
}
