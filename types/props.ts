import type { StyleProp, ViewStyle } from "react-native";

export type ViewStyleProps = StyleProp<ViewStyle>;

export interface WithViewStyle {
  style?: ViewStyleProps;
}
