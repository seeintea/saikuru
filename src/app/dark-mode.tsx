import { Header } from "@/components/header";
import { DarkMode } from "@/features/dark-mode";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DarkModeScreen() {
  return (
    <SafeAreaView>
      <Header title="深色模式" />
      <DarkMode />
    </SafeAreaView>
  );
}
