import { useTheme } from "@/hooks/use-theme";
import { getAllRecords, type RecordListItem } from "@server/store/record";
import { useFocusEffect } from "@react-navigation/native";
import { memo, useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

function RecordSeparator() {
  return <View className="h-3" />;
}

function RecordEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <Text className="text-lg font-semibold text-text-primary">暂无记录</Text>
      <Text className="mt-2 text-center text-sm text-text-secondary">
        完成任务后，记录会显示在这里
      </Text>
    </View>
  );
}

type RecordErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function RecordErrorState({ message, onRetry }: RecordErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <Text className="text-lg font-semibold text-error">记录加载失败</Text>
      <Text className="mt-2 text-center text-sm text-text-secondary">{message}</Text>
      <Pressable className="mt-4 rounded-full bg-primary px-5 py-2 active:opacity-80" onPress={onRetry}>
        <Text className="text-sm font-semibold text-surface-lightest">重试</Text>
      </Pressable>
    </View>
  );
}

type RecordItemProps = {
  item: RecordListItem;
};

const RecordItem = memo(function RecordItem({ item }: RecordItemProps) {
  const { color } = useTheme();
  const summary = [`完成 ${item.count} 次`, item.duration > 0 ? `时长 ${item.duration} 分钟` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <View className="rounded-3xl border border-border bg-surface-lightest p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-light"
            style={item.taskColor ? { backgroundColor: item.taskColor } : undefined}
          >
            {item.taskIcon ? (
              <Text className="text-lg">{item.taskIcon}</Text>
            ) : (
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.taskColor ?? color.primary }}
              />
            )}
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-base font-semibold text-text-primary" numberOfLines={1}>
              {item.taskName}
            </Text>
            <Text className="mt-1 text-sm text-text-secondary">{summary}</Text>
          </View>
        </View>
        <Text className="text-sm text-text-tertiary">{item.date}</Text>
      </View>

      {item.notes ? (
        <Text className="mt-3 text-sm leading-5 text-text-secondary" numberOfLines={2}>
          {item.notes}
        </Text>
      ) : null}
    </View>
  );
});

export default function Record() {
  const { color } = useTheme();
  const [records, setRecords] = useState<RecordListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextRecords = await getAllRecords();
      setRecords(nextRecords);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "请稍后重试");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  if (isLoading && records.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator color={color.primary} />
        <Text className="text-sm text-text-secondary">加载记录中...</Text>
      </View>
    );
  }

  if (error && records.length === 0) {
    return <RecordErrorState message={error} onRetry={loadRecords} />;
  }

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RecordItem item={item} />}
      contentContainerClassName="flex-grow px-4 py-4"
      ItemSeparatorComponent={RecordSeparator}
      ListEmptyComponent={RecordEmptyState}
      refreshing={isLoading}
      onRefresh={loadRecords}
      showsVerticalScrollIndicator={false}
    />
  );
}
