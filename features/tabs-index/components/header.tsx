import { PrimaryButton } from '@/components/primary-button';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCheck, ChevronDown, Sprout } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function Header() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.hd}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.task}>
            <Sprout size={18} color={'#c6ff00'} />
            <Text style={styles['task-label']}>2026打卡</Text>
            <ChevronDown size={18} color={'#c6ff00'} />
          </View>
        </TouchableOpacity>
        <PrimaryButton onPress={() => {}}>
          <View style={styles.button}>
            <CheckCheck size={16} color={'#485e00'} />
            <Text style={styles['button-text']}>立即打卡</Text>
          </View>
        </PrimaryButton>
      </View>
      <LinearGradient
        colors={['rgba(198, 255, 0, 0.12)', 'rgba(198, 255, 0, 0.04)', 'rgba(198, 255, 0, 0)']}
        style={styles.shadow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  hd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingInline: 24,
    paddingBlock: 12,
    backgroundColor: '#0e0e0e',
    zIndex: 1,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ['task-label']: {
    fontSize: 22,
    fontWeight: 600,
    color: '#c6ff00',
  },
  button: {
    color: '#485e00',
    fontWeight: 600,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ['button-text']: {
    color: '#485e00',
    fontWeight: '600',
    fontSize: 14,
  },
  shadow: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 50,
    pointerEvents: 'none',
  },
});
