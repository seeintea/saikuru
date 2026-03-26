import { Button } from "@/components/ui/button";
import { FONTS } from "@/hooks/use-custom-fonts";
import type { TaskFormInput } from "@/types/task-config";
import { DEFAULT_TASK_FORM_INPUT } from "@/types/task-config";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export function TabsCreate() {
  const [form, setForm] = useState<TaskFormInput>(DEFAULT_TASK_FORM_INPUT);

  const handleInputChange = (field: keyof TaskFormInput, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      name: `里程碑 ${form.milestones.length + 1}`,
      target: 0,
      type: "count" as const,
    };
    setForm((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }));
  };

  const handleRemoveMilestone = (id: string) => {
    setForm((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const handleMilestoneChange = (id: string, field: keyof any, value: any) => {
    setForm((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  const handleSubmit = () => {
    // 这里应该添加表单验证和提交逻辑
    const countTarget = form.countTarget ? parseInt(form.countTarget, 10) : undefined;
    const timeTarget = form.timeTarget ? parseInt(form.timeTarget, 10) : undefined;

    const task = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description,
      icon: "default",
      config: {
        cycleType: form.cycleType,
        cycleLength: form.cycleLength,
        countTarget,
        timeTarget,
        targetLogic: form.targetLogic,
        milestones: form.milestones,
      },
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // 提交到存储
    console.log("Creating task:", task);
    alert("任务创建成功！");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {/* 页面标题 */}
        <Text style={styles.title}>创建任务</Text>

        {/* 任务基本信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          <TextInput
            style={styles.input}
            placeholder="任务名称"
            placeholderTextColor="#666"
            value={form.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="任务描述"
            placeholderTextColor="#666"
            value={form.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 周期设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>周期设置</Text>
          <View style={styles.cycleContainer}>
            <View style={styles.cycleInputContainer}>
              <TextInput
                style={[styles.input, styles.numberInput]}
                placeholder="长度"
                placeholderTextColor="#666"
                value={form.cycleLength.toString()}
                onChangeText={(text) => handleInputChange("cycleLength", parseInt(text) || 1)}
                keyboardType="numeric"
              />
              <View style={styles.cycleTypeContainer}>
                {(["days", "weeks", "months"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.cycleTypeButton, form.cycleType === type && styles.cycleTypeButtonActive]}
                    onPress={() => handleInputChange("cycleType", type)}
                  >
                    <Text
                      style={[styles.cycleTypeText, form.cycleType === type && styles.cycleTypeTextActive]}
                    >
                      {type === "days" ? "天" : type === "weeks" ? "周" : "月"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 目标设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>目标设置</Text>
          <TextInput
            style={styles.input}
            placeholder="打卡次数目标"
            placeholderTextColor="#666"
            value={form.countTarget}
            onChangeText={(text) => handleInputChange("countTarget", text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="累计时间目标(分钟)"
            placeholderTextColor="#666"
            value={form.timeTarget}
            onChangeText={(text) => handleInputChange("timeTarget", text)}
            keyboardType="numeric"
          />
          <View style={styles.logicContainer}>
            <Text style={styles.logicLabel}>目标关系：</Text>
            <TouchableOpacity
              style={[styles.logicButton, form.targetLogic === "and" && styles.logicButtonActive]}
              onPress={() => handleInputChange("targetLogic", "and")}
            >
              <Text style={[styles.logicText, form.targetLogic === "and" && styles.logicTextActive]}>且</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logicButton, form.targetLogic === "or" && styles.logicButtonActive]}
              onPress={() => handleInputChange("targetLogic", "or")}
            >
              <Text style={[styles.logicText, form.targetLogic === "or" && styles.logicTextActive]}>或</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 里程碑设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>里程碑设置</Text>
          <TouchableOpacity style={styles.addMilestoneButton} onPress={handleAddMilestone}>
            <Text style={styles.addMilestoneText}>+ 添加里程碑</Text>
          </TouchableOpacity>
          {form.milestones.map((milestone) => (
            <View key={milestone.id} style={styles.milestoneContainer}>
              <View style={styles.milestoneInputContainer}>
                <TextInput
                  style={[styles.input, styles.milestoneName]}
                  placeholder="里程碑名称"
                  placeholderTextColor="#666"
                  value={milestone.name}
                  onChangeText={(text) => handleMilestoneChange(milestone.id, "name", text)}
                />
                <TextInput
                  style={[styles.input, styles.milestoneTarget]}
                  placeholder="目标值"
                  placeholderTextColor="#666"
                  value={milestone.target.toString()}
                  onChangeText={(text) => handleMilestoneChange(milestone.id, "target", parseInt(text) || 0)}
                  keyboardType="numeric"
                />
                <View style={styles.milestoneTypeContainer}>
                  {(["count", "time"] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.milestoneTypeButton,
                        milestone.type === type && styles.milestoneTypeButtonActive,
                      ]}
                      onPress={() => handleMilestoneChange(milestone.id, "type", type)}
                    >
                      <Text
                        style={[
                          styles.milestoneTypeText,
                          milestone.type === type && styles.milestoneTypeTextActive,
                        ]}
                      >
                        {type === "count" ? "次" : "分钟"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.removeMilestoneButton}
                  onPress={() => handleRemoveMilestone(milestone.id)}
                >
                  <Text style={styles.removeMilestoneText}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* 提交按钮 */}
        <Button style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>创建任务</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0e0e0e",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.alimamaAgile,
    color: "#A3FF00",
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
    marginBottom: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  cycleContainer: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
  cycleInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  numberInput: {
    flex: 1,
    marginBottom: 0,
  },
  cycleTypeContainer: {
    flexDirection: "row",
    gap: 4,
  },
  cycleTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 6,
  },
  cycleTypeButtonActive: {
    backgroundColor: "#A3FF00",
  },
  cycleTypeText: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#666",
  },
  cycleTypeTextActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  logicContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  logicLabel: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
  },
  logicButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 6,
  },
  logicButtonActive: {
    backgroundColor: "#A3FF00",
  },
  logicText: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#666",
  },
  logicTextActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  addMilestoneButton: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  addMilestoneText: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#A3FF00",
    fontWeight: "600",
  },
  milestoneContainer: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  milestoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  milestoneName: {
    flex: 2,
    marginBottom: 0,
  },
  milestoneTarget: {
    flex: 1,
    marginBottom: 0,
  },
  milestoneTypeContainer: {
    flexDirection: "row",
    gap: 4,
  },
  milestoneTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 6,
  },
  milestoneTypeButtonActive: {
    backgroundColor: "#A3FF00",
  },
  milestoneTypeText: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#666",
  },
  milestoneTypeTextActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  removeMilestoneButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 6,
  },
  removeMilestoneText: {
    fontSize: 14,
    fontFamily: FONTS.alimamaAgile,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: FONTS.alimamaAgile,
    color: "#000000",
    fontWeight: "bold",
  },
});
