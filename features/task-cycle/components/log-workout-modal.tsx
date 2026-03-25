import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { X, Minus, Plus } from "lucide-react-native";
import { WORKOUT_TYPES } from "@/features/task-cycle/constants";

interface LogWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (duration: number, workoutType?: string, notes?: string) => void;
}

export default function LogWorkoutModal({ visible, onClose, onSubmit }: LogWorkoutModalProps) {
  const [duration, setDuration] = React.useState(30);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (visible) {
      setDuration(30);
      setSelectedType("");
      setNotes("");
    }
  }, [visible]);

  const handleDecrease = () => {
    if (duration > 5) {
      setDuration(duration - 5);
    }
  };

  const handleIncrease = () => {
    setDuration(duration + 5);
  };

  const handleSubmit = () => {
    onSubmit(duration, selectedType || undefined, notes || undefined);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>记录锻炼</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#9BA1A6" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* 锻炼时长 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>锻炼时长</Text>
                <View style={styles.durationControl}>
                  <TouchableOpacity
                    style={styles.durationButton}
                    onPress={handleDecrease}
                    activeOpacity={0.7}
                  >
                    <Minus size={24} color="#ECEDEE" />
                  </TouchableOpacity>
                  <View style={styles.durationDisplay}>
                    <Text style={styles.durationText}>{duration}</Text>
                    <Text style={styles.durationUnit}>分钟</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.durationButton}
                    onPress={handleIncrease}
                    activeOpacity={0.7}
                  >
                    <Plus size={24} color="#ECEDEE" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 锻炼类型 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>锻炼类型（可选）</Text>
                <View style={styles.typeGrid}>
                  {WORKOUT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeButton, selectedType === type && styles.typeButtonActive]}
                      onPress={() => setSelectedType(selectedType === type ? "" : type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.typeButtonText, selectedType === type && styles.typeButtonTextActive]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 备注 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>备注（可选）</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="添加备注..."
                  placeholderTextColor="#687076"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>确认记录</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
  },
  title: {
    color: "#ECEDEE",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: "70%",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#ECEDEE",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  durationControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  durationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2D2D2D",
    justifyContent: "center",
    alignItems: "center",
  },
  durationDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  durationText: {
    color: "#A3FF00",
    fontSize: 48,
    fontWeight: "bold",
  },
  durationUnit: {
    color: "#9BA1A6",
    fontSize: 18,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#2D2D2D",
    borderWidth: 1,
    borderColor: "#3D3D3D",
  },
  typeButtonActive: {
    backgroundColor: "rgba(163, 255, 0, 0.15)",
    borderColor: "#A3FF00",
  },
  typeButtonText: {
    color: "#9BA1A6",
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: "#A3FF00",
    fontWeight: "500",
  },
  notesInput: {
    backgroundColor: "#2D2D2D",
    borderRadius: 12,
    padding: 12,
    color: "#ECEDEE",
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#2D2D2D",
  },
  submitButton: {
    backgroundColor: "#A3FF00",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#151718",
    fontSize: 16,
    fontWeight: "600",
  },
});
