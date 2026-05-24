import { useTheme } from "@/hooks/use-theme";
import * as SwitchPrimitive from "@rn-primitives/switch";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const THUMB_PADDING = 2;

export function Switch({ checked, onCheckedChange, disabled }: SwitchProps) {
  const progress = useDerivedValue(() => (checked ? 1 : 0), [checked]);
  const { color } = useTheme();

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [color.surfaceDark, color.primaryDark]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(checked ? TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING * 2 : 0, {
          damping: 50,
          stiffness: 250,
        }),
      },
    ],
  }));

  return (
    <SwitchPrimitive.Root checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} asChild>
      <Pressable>
        <Animated.View
          className="rounded-full"
          style={[{ width: TRACK_WIDTH, height: TRACK_HEIGHT }, trackStyle]}
        >
          <Animated.View
            className="absolute rounded-full bg-surface-lightest shadow"
            style={[
              {
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                top: THUMB_PADDING,
                left: THUMB_PADDING,
                shadowOpacity: 0.15,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1.5 },
                elevation: 2,
              },
              thumbStyle,
            ]}
          />
        </Animated.View>
      </Pressable>
    </SwitchPrimitive.Root>
  );
}
