import { FONTS } from "@/hooks/use-fonts";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const router = useRouter();
  const { color } = useTheme();

  return (
    <View className="items-center justify-center px-4 h-12">
      <Pressable
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="absolute left-2 h-full items-center justify-center"
      >
        <ChevronLeft size={20} color={color.textPrimary} />
      </Pressable>
      <Text className="text-text-primary text-lg font-bold" style={{ fontFamily: FONTS.alibabaPuHui }}>
        {title}
      </Text>
    </View>
  );
}
