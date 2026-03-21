import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';

interface PageHeaderProps {
  onLogWorkout: () => void;
}

export default function PageHeader({ onLogWorkout }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>Saikuru 健身打卡</Text>
      </View>
      <TouchableOpacity style={styles.logButton} onPress={onLogWorkout} activeOpacity={0.8}>
        <Plus size={20} color="#151718" strokeWidth={2.5} />
        <Text style={styles.logButtonText}>立即打卡</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#151718',
  },
  leftSection: {
    flex: 1,
  },
  title: {
    color: '#ECEDEE',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3FF00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  logButtonText: {
    color: '#151718',
    fontSize: 15,
    fontWeight: '600',
  },
});
