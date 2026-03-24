import { StyleSheet, Text, View } from 'react-native';

export default function ShareScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
    paddingBottom: 100, // 为底部悬浮 tab 预留空间
  },
  title: {
    color: '#A3FF00',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
