import { BackgroundView } from "@/components/background-view";
import { Header } from "@/components/header";
import { Create } from "@/features/create";

export default function CreateScreen() {
  return (
    <BackgroundView>
      <Header title="创建任务" />
      <Create />
    </BackgroundView>
  );
}
