import { TabScreenWrapper } from '@/components/tab-screen-wrapper';
import { TabsCreate } from '@/features/tabs-create';
import { StyleSheet } from 'react-native';

export default function CreateScreen() {
  return (
    <TabScreenWrapper style={styles.container}>
      <TabsCreate />
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
