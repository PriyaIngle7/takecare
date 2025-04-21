import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export default function AlarmScreen() {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmLabel, setAlarmLabel] = useState("");
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = now.getHours() + ":" + now.getMinutes();
      const triggeredAlarm = alarms.find(
        (alarm) => alarm.time === currentTime && alarm.enabled
      );
      if (triggeredAlarm?.label.toLowerCase() === "medicine") {
        navigation.navigate("ActivityScreen", { alarmLabel: "Medicine" });
      }
    }, 60000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  const addAlarm = () => {
    if (alarmTime && alarmLabel) {
      setAlarms([
        ...alarms,
        {
          id: Date.now().toString(),
          time: alarmTime,
          label: alarmLabel,
          enabled: true,
        },
      ]);
      setAlarmTime("");
      setAlarmLabel("");
      setModalVisible(false);
    }
  };

  const removeAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.avatar}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
          }}
        />
        <View>
          <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
          <Text style={styles.userName}>John Doe</Text>
        </View>
      </View>

      <View style={styles.alarmHeader}>
        <Text style={styles.alarmTitle}>Your Alarms</Text>
        <TouchableOpacity
          style={styles.addAlarmButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addAlarmText}>+ Add Alarm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.reminderContainer}>
            <View style={styles.textInfo}>
              <Text style={styles.timeText}>{item.time}</Text>
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleAlarm(item.id)}
            />
            <TouchableOpacity onPress={() => removeAlarm(item.id)}>
              <FontAwesome name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Alarm</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Alarm Label (e.g. Medicine)"
              value={alarmLabel}
              onChangeText={setAlarmLabel}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Alarm Time (e.g., 7:00 AM)"
              value={alarmTime}
              onChangeText={setAlarmTime}
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.saveButton} onPress={addAlarm}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: { fontSize: 14, color: "#1E90FF" },
  userName: { fontSize: 18, fontWeight: "bold", color: "#333" },

  alarmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  alarmTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  addAlarmButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addAlarmText: { color: "#fff", fontSize: 16 },

  listContent: { paddingBottom: 80 },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E3F2FD",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  textInfo: {
    flex: 1,
    marginRight: 10,
  },
  timeText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  labelText: { fontSize: 14, color: "#555" },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#1E90FF",
    fontSize: 16,
    fontWeight: "500",
  },
});
