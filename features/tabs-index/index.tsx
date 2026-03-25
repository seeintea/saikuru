import { CustomCalendar } from '@/components/custom-calendar';
import { tabPaddingBottom } from '@/components/tab-screen-wrapper';
import { Card } from '@/components/ui/card';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from './components/header';

export function TabsIndex() {
  return (
    <View style={{ flex: 1 }}>
      <Header style={common.px24} />
      <ScrollView style={{ flex: 1, paddingBottom: tabPaddingBottom }}>
        <Card style={[common.mx24, styles.summary]}>
          <View>
            <Text>thinking...</Text>
          </View>
        </Card>
        <Card style={[common.mx24, styles.calendar]}>
          <CustomCalendar />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginTop: 24,
    minHeight: 400,
    backgroundColor: 'rgba(32,32,32,0.75)',
  },
  calendar: {
    marginTop: 24,
  },
});

const common = StyleSheet.create({
  px24: {
    paddingInline: 24,
  },
  mx24: {
    marginInline: 24,
  },
});
