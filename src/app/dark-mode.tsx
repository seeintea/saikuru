import { BackgroundView } from "@/components/background-view";
import { Header } from "@/components/header";
import { DarkMode } from "@/features/dark-mode";

export default function DarkModeScreen() {
  return (
    <BackgroundView>
      <Header title="深色模式" />
      <DarkMode />
    </BackgroundView>
  );
}
