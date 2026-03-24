import { StyleSheet, Text } from 'react-native';

export function TabsCreate() {
  return <Text style={styles.title}>创建</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: '#A3FF00',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
