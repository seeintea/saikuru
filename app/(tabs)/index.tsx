import { TabScreenWrapper } from '@/components/tab-screen-wrapper';
import { TabsIndex } from '@/features/tabs-index';

export default function IndexScreen() {
  return (
    <TabScreenWrapper style={{ paddingBottom: 0 }}>
      <TabsIndex />
    </TabScreenWrapper>
  );
}
