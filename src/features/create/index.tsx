import { Button } from "@/components/button";
import { DateField } from "@/components/date-field";
import { Input } from "@/components/input";
import { InputNumber } from "@/components/input-number";
import { Segmented } from "@/components/segmented";
import { Select } from "@/components/select";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Heading } from "./components/heading";
import type { CreateFormItem } from "./data";

function getTodayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
}

export function Create() {
  const { control, handleSubmit, setValue } = useForm<CreateFormItem>({
    defaultValues: {
      name: "",
      description: "",
      cycleType: "days",
      cycleLength: 1,
      cycleStartDate: getTodayString(),
      isInfinite: true,
      taskEndDate: undefined,
      targetLogic: "and",
      targets: [{ targetType: "frequency", targetValue: 1, operator: "gte" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "targets" });
  const isInfinite = useWatch({ control, name: "isInfinite" });
  const onSubmit = (data: CreateFormItem) => console.log(data);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4 px-4 py-2"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Heading title="基本信息" />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="请输入任务名称" onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="name"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="请输入任务描述" onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="description"
      />

      <Heading title="周期" />

      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputNumber
                placeholder="请输入周期"
                onBlur={onBlur}
                onValueChange={onChange}
                value={value}
                min={1}
              />
            )}
            name="cycleLength"
          />
        </View>

        <View className="w-28">
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onValueChange={onChange}
                options={[
                  { label: "天", value: "days" },
                  { label: "周", value: "weeks" },
                  { label: "月", value: "months" },
                ]}
              />
            )}
            name="cycleType"
          />
        </View>
      </View>

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <DateField label="开始日期" value={value} onChange={onChange} />
        )}
        name="cycleStartDate"
      />

      <Heading title="结束条件" />

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Segmented
            value={value ? "infinite" : "date"}
            onValueChange={(nextValue) => {
              const nextIsInfinite = nextValue === "infinite";
              onChange(nextIsInfinite);
              setValue("taskEndDate", nextIsInfinite ? undefined : getTodayString());
            }}
            options={[
              { label: "长期坚持", value: "infinite" },
              { label: "到指定日期", value: "date" },
            ]}
          />
        )}
        name="isInfinite"
      />

      {!isInfinite ? (
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <DateField label="结束日期" value={value ?? getTodayString()} onChange={onChange} />
          )}
          name="taskEndDate"
        />
      ) : null}

      <Heading title="目标" />

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Segmented
            value={value}
            onValueChange={onChange}
            options={[
              { label: "全部达成", value: "and" },
              { label: "任一达成", value: "or" },
            ]}
          />
        )}
        name="targetLogic"
      />

      {fields.map((field, index) => (
        <View key={field.id} className="gap-3 rounded-3xl bg-surface-lightest p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-text-primary">
              目标 {index + 1}
            </Text>
            {fields.length > 1 ? (
              <Pressable
                className="rounded-full px-3 py-1 active:bg-surface-light"
                onPress={() => remove(index)}
              >
                <Text className="text-sm font-medium text-error">删除</Text>
              </Pressable>
            ) : null}
          </View>

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Segmented
                value={value}
                onValueChange={onChange}
                options={[
                  { label: "次数", value: "frequency" },
                  { label: "数量", value: "count" },
                  { label: "时长", value: "duration" },
                ]}
              />
            )}
            name={`targets.${index}.targetType`}
          />

          <View className="flex-row items-center gap-3">
            <View className="w-28">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={onChange}
                    options={[
                      { label: "至少", value: "gte" },
                      { label: "最多", value: "lte" },
                      { label: "刚好", value: "eq" },
                    ]}
                  />
                )}
                name={`targets.${index}.operator`}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputNumber placeholder="请输入目标值" onBlur={onBlur} onValueChange={onChange} value={value} min={0} />
                )}
                name={`targets.${index}.targetValue`}
              />
            </View>
          </View>
        </View>
      ))}

      <Pressable
        className="items-center rounded-3xl border border-dashed border-border px-4 py-3 active:bg-surface-light"
        onPress={() => append({ targetType: "frequency", targetValue: 1, operator: "gte" })}
      >
        <Text className="text-base font-medium text-primary-dark">添加目标</Text>
      </Pressable>

      <View className="py-6">
        <Button title="提交" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}
