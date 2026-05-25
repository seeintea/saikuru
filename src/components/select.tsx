import { useTheme } from "@/hooks/use-theme";
import * as SelectPrimitive from "@rn-primitives/select";
import { Check, ChevronDown } from "lucide-react-native";
import { useMemo } from "react";
import { Dimensions, Pressable } from "react-native";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

const ESTIMATED_CONTENT_HEIGHT = 180;

function AdaptiveContent({ children }: { children: React.ReactNode }) {
  const { triggerPosition } = SelectPrimitive.useRootContext();
  const screenHeight = Dimensions.get("screen").height;

  const side = useMemo<"top" | "bottom">(() => {
    if (!triggerPosition) return "bottom";
    const spaceBelow = screenHeight - (triggerPosition.pageY + triggerPosition.height);
    return spaceBelow < ESTIMATED_CONTENT_HEIGHT ? "top" : "bottom";
  }, [triggerPosition, screenHeight]);

  return (
    <SelectPrimitive.Content
      side={side}
      align="start"
      sideOffset={6}
      style={triggerPosition ? { width: triggerPosition.width } : undefined}
      className="overflow-hidden rounded-3xl bg-surface-lightest shadow-lg"
    >
      {children}
    </SelectPrimitive.Content>
  );
}

export function Select<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
}: SelectProps<T>) {
  const { color } = useTheme();
  const selected = options.find((option) => option.value === value);

  return (
    <SelectPrimitive.Root
      value={selected ? { value: selected.value, label: selected.label } : undefined}
      onValueChange={(option) => {
        if (option?.value) onValueChange(option.value as T);
      }}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger asChild>
        <Pressable
          className="flex-row items-center rounded-3xl bg-surface-light px-4 active:opacity-80"
          disabled={disabled}
        >
          <SelectPrimitive.Value
            placeholder={placeholder ?? ""}
            className="flex-1 py-3 text-base font-medium text-primary"
          />
          <ChevronDown size={18} color={color.textTertiary} />
        </Pressable>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Overlay className="absolute inset-0" />
        <AdaptiveContent>
          {options.map((option) => (
            <SelectPrimitive.Item
              key={option.value}
              value={option.value}
              label={option.label}
              asChild
            >
              <Pressable className="flex-row items-center justify-between gap-4 px-4 py-3 active:bg-surface-light">
                <SelectPrimitive.ItemText className="text-base text-text-primary" />
                <SelectPrimitive.ItemIndicator>
                  <Check size={18} color={color.primary} />
                </SelectPrimitive.ItemIndicator>
              </Pressable>
            </SelectPrimitive.Item>
          ))}
        </AdaptiveContent>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
