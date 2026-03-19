import React, { useEffect } from 'react';
import { config } from './config';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from 'nativewind';

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // 安全地注入 CSS 变量到 DOM（仅在浏览器环境中）
  useEffect(() => {
    if (typeof document !== 'undefined' && colorScheme) {
      const root = document.documentElement;
      const currentConfig = config[colorScheme];

      // 注入所有 CSS 变量
      Object.entries(currentConfig).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // 设置颜色方案类
      root.classList.remove('light', 'dark');
      root.classList.add(colorScheme);
      root.style.colorScheme = colorScheme;
    }
  }, [colorScheme]);

  return (
    <View style={[config[colorScheme!], { flex: 1, height: '100%', width: '100%' }, props.style]}>
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
