import type { ReactNode } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';

interface TabScreenWrapperProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TabScreenWrapper({ children, style = {} }: TabScreenWrapperProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    paddingBottom: 100, // 为底部悬浮 tab 预留足够的空间
  },
});
