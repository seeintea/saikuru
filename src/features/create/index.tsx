import { Switch } from "@/components/switch";
import { Controller, useForm } from "react-hook-form";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { Heading } from "./components/heading";
import { CreateFormItem } from "./data";

export function Create() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormItem>({
    defaultValues: {
      name: "",
      description: "",
      cycleType: "days",
      cycleLength: 0,
      cycleStartDate: "",
      isInfinite: 0,
      targetLogic: "and",
    },
  });

  const onSubmit = (data: CreateFormItem) => console.log(data);

  return (
    <ScrollView
      className={"flex-1 py-2 px-4"}
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
          <TextInput placeholder="请输入任务名称" onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="name"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput placeholder="请输入任务描述" onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="description"
      />

      {/* TODO: select component  cycleType */}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType="number-pad"
            placeholder="请输入周期长度"
            onBlur={onBlur}
            onChangeText={onChange}
            value={`${value}`}
          />
        )}
        name="cycleLength"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType="number-pad"
            placeholder="请输入周期开始时间"
            onBlur={onBlur}
            onChangeText={onChange}
            value={`${value}`}
          />
        )}
        name="cycleStartDate"
      />

      <View className={"flex-row items-center"}>
        <Text>是否无限循环</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Switch onCheckedChange={onChange} checked={value === 1} />
          )}
          name="isInfinite"
        />
      </View>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType="number-pad"
            placeholder="请输入周期结束时间"
            onBlur={onBlur}
            onChangeText={onChange}
            value={`${value}`}
          />
        )}
        name="taskEndDate"
      />

      {/* TODO: select component  targetLogic */}

      {/* targets  items */}

      {/* TODO: select component  targetType */}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            keyboardType="number-pad"
            placeholder="请输入周期长度"
            onBlur={onBlur}
            onChangeText={onChange}
            value={`${value}`}
          />
        )}
        name="targets.0.targetValue"
      />

      {/* TODO: select component  operator */}

      <Button title="提交" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}
