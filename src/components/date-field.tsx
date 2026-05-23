import { Modal, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { DateWheelPicker } from "./date-wheel-picker";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function getTodayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
}

function getDisplayValue(value: string) {
  if (value === getTodayString()) return "今天";
  return value.replaceAll("-", "/");
}

export function DateField({ label, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        className="flex-row items-center justify-between rounded-2xl bg-surface-light dark:bg-surface-dark px-4 py-3"
        onPress={() => setOpen(true)}
      >
        <Text className="text-base text-text-primary dark:text-text-primary">{label}</Text>
        <Text className="text-base font-medium text-primary-light dark:text-primary-dark">
          {getDisplayValue(value)}
        </Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <Pressable className="absolute inset-0" onPress={() => setOpen(false)} />
          <View className="w-full max-w-md overflow-hidden rounded-3xl bg-surface-lightest dark:bg-surface-light shadow-lg">
            <DateWheelPicker
              value={value || getTodayString()}
              onCancel={() => setOpen(false)}
              onConfirm={(nextValue) => {
                onChange(nextValue);
                setOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
