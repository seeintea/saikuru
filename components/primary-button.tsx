import { ReactNode } from 'react';
import {
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface PrimaryButtonProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  onPress: (event?: GestureResponderEvent) => void;
}

export function PrimaryButton({ style, children, onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.9}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c6ff00',
    borderRadius: 32,
    paddingInline: 16,
    fontSize: 14,
  },
});
