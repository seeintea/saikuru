import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface DateWheelPickerProps {
  value: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getTodayString() {
  const today = new Date();
  return formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

function WheelColumn({
  items,
  value,
  onChange,
  suffix,
}: {
  items: number[];
  value: number;
  onChange: (value: number) => void;
  suffix: string;
}) {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      contentOffset={{ x: 0, y: Math.max(items.indexOf(value), 0) * ITEM_HEIGHT }}
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        const nextValue = items[Math.min(Math.max(index, 0), items.length - 1)];
        onChange(nextValue);
      }}
    >
      {items.map((item) => {
        const selected = item === value;

        return (
          <Pressable
            key={item}
            className="items-center justify-center"
            style={{ height: ITEM_HEIGHT }}
            onPress={() => onChange(item)}
          >
            <Text
              className={`text-lg ${
                selected
                  ? "font-semibold text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {item}
              {suffix}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function DateWheelPicker({ value, onCancel, onConfirm }: DateWheelPickerProps) {
  const initialDate = parseDate(value || getTodayString());
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 11 }, (_, index) => currentYear - 5 + index),
    [currentYear]
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const [year, setYear] = useState(initialDate.year);
  const [month, setMonth] = useState(initialDate.month);
  const [day, setDay] = useState(initialDate.day);

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, index) => index + 1),
    [year, month]
  );
  const safeDay = Math.min(day, days.length);

  return (
    <View className="bg-surface-lightest p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Pressable onPress={onCancel} className="px-2 py-1">
          <Text className="text-base text-text-secondary">取消</Text>
        </Pressable>
        <Text className="text-base font-semibold text-text-primary">选择日期</Text>
        <Pressable onPress={() => onConfirm(formatDate(year, month, safeDay))} className="px-2 py-1">
          <Text className="text-base font-semibold text-primary">确定</Text>
        </Pressable>
      </View>

      <View
        className="relative flex-row overflow-hidden rounded-2xl bg-surface-light"
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
      >
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-1/2 border-y border-border"
          style={{ height: ITEM_HEIGHT, marginTop: -ITEM_HEIGHT / 2 }}
        />
        <WheelColumn items={years} value={year} onChange={setYear} suffix="年" />
        <WheelColumn items={months} value={month} onChange={setMonth} suffix="月" />
        <WheelColumn key={`${year}-${month}`} items={days} value={safeDay} onChange={setDay} suffix="日" />
      </View>
    </View>
  );
}
