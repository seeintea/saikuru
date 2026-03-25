import type { WithViewStyle } from '@/types';
import { ReactNode } from 'react';
import { type GestureResponderEvent, StyleSheet, TouchableOpacity } from 'react-native';

interface ButtonProps extends WithViewStyle {
  children: ReactNode;
  onPress: (event?: GestureResponderEvent) => void;
}

export function Button({ style, children, onPress }: ButtonProps) {
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
