import type { WithViewStyle } from '@/types';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface CardProps extends WithViewStyle {
  children: ReactNode;
}

export function Card({ style = {}, children }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    paddingBlock: 24,
    paddingInline: 32,
    borderRadius: 48,
    backgroundColor: '#131313',
  },
});
