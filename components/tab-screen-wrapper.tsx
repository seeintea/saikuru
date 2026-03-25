import type { WithViewStyle } from '@/types';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export const tabPaddingBottom = 100;

interface TabScreenWrapperProps extends WithViewStyle {
  children: ReactNode;
}

export function TabScreenWrapper({ children, style = {} }: TabScreenWrapperProps) {
  return (
    <View style={[styles.container, { paddingBottom: tabPaddingBottom }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
});
