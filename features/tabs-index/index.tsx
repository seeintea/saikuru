import { ScrollView, View } from 'react-native';
import { Header } from './components/header';

export function TabsIndex() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Header />
      </ScrollView>
    </View>
  );
}
