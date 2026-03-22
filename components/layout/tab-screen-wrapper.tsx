import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface TabScreenWrapperProps {
  children: ReactNode;
  style?: any;
}

/**
 * 通用的 tab 页面包装组件
 * 为底部悬浮 tab 提供适当的底部间距，确保内容不会被遮挡
 */
export default function TabScreenWrapper({ children, style }: TabScreenWrapperProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100, // 为底部悬浮 tab 预留足够的空间
  },
});
