import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 h-12">
      <Pressable
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="p-2 -ml-2 z-50"
      >
        <ChevronLeft size={24} />
      </Pressable>
      <Text className="absolute left-0 right-0 text-center text-base font-bold">{title}</Text>
      <View className="w-6" />
    </View>
  );
}
