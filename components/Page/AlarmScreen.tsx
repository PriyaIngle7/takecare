import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Image, StyleSheet, TextInput, FlatList, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ProfileSVG from "../../assets/images/profile";

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export default function AlarmScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmLabel, setAlarmLabel] = useState("");
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      alert("Recording saved!");
    }, 120000);
  };

  const addAlarm = () => {
    if (alarmTime && alarmLabel) {
      setAlarms([...alarms, { id: Date.now().toString(), time: alarmTime, label: alarmLabel, enabled: true }]);
      setAlarmTime("");
      setAlarmLabel("");
      setModalVisible(false);
    }
  };

  const removeAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm => alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm));
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
      <ProfileSVG style={styles.profileImage} />
        <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
        <Text style={styles.userName}>John Doe</Text>
      </View>
      
      <View style={styles.alarmContainer}>
        <Text style={styles.alarmText}>Alarm</Text>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recording]}
          onLongPress={handleLongPress}
        >
          <Text style={styles.recordText}>{isRecording ? "Recording..." : "Hold to Record"}</Text>
          <FontAwesome name="microphone" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addAlarmButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addAlarmText}>+ Add Alarm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderContainer}>
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.labelText}>{item.label}</Text>
            <Switch value={item.enabled} onValueChange={() => toggleAlarm(item.id)} />
            <TouchableOpacity onPress={() => removeAlarm(item.id)}>
              <FontAwesome name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set New Alarm</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Alarm Label (e.g., Medicine)"
              value={alarmLabel}
              onChangeText={setAlarmLabel}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Alarm Time (e.g., 7:00 AM)"
              value={alarmTime}
              onChangeText={setAlarmTime}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addAlarm}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
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
  profileContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  welcomeText: { fontSize: 14, color: "#1E90FF" },
  userName: { fontSize: 16, fontWeight: "bold" },
  alarmContainer: { alignItems: "center", backgroundColor: "#E3F2FD", padding: 20, borderRadius: 15, marginBottom: 20 },
  alarmText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  recordButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E90FF", padding: 15, borderRadius: 10, marginBottom: 10 },
  recording: { backgroundColor: "#FF4500" },
  recordText: { color: "#fff", marginRight: 10 },
  addAlarmButton: { backgroundColor: "#1E90FF", padding: 10, borderRadius: 8, marginTop: 10 },
  addAlarmText: { color: "#fff", fontSize: 16 },
  reminderContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#E3F2FD", padding: 15, borderRadius: 10, marginBottom: 10, justifyContent: "space-between" },
  timeText: { fontSize: 16, fontWeight: "bold" },
  labelText: { fontSize: 14, color: "#333" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%", alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { width: "100%", padding: 10, backgroundColor: "#E3F2FD", borderRadius: 8, textAlign: "center", marginBottom: 10 },
  saveButton: { backgroundColor: "#1E90FF", padding: 10, borderRadius: 8, marginTop: 10 },
  saveButtonText: { color: "#fff" },
  cancelButton: { marginTop: 10 },
  cancelButtonText: { color: "red" },
});