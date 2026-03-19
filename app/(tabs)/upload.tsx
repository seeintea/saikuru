import { StyleSheet, Text, View } from 'react-native';

export default function ShareScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>上传</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  title: {
    color: '#A3FF00',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
