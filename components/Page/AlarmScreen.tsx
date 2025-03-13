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
    }, 60000); // Check every 60 seconds

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
          style={{ width: 50, height: 50, borderRadius: 100 }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
          }}
        />
        <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
        <Text style={styles.userName}>John Doe</Text>
      </View>

      <View style={styles.alarmContainer}>
        <Text style={styles.alarmText}>Alarm</Text>
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
        renderItem={({ item }) => (
          <View style={styles.reminderContainer}>
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.labelText}>{item.label}</Text>
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
            <TextInput
              style={styles.input}
              placeholder="Enter Alarm Label (e.g. Medicine)"
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FA" },
  profileContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  welcomeText: { fontSize: 14, color: "#1E90FF" },
  userName: { fontSize: 16, fontWeight: "bold" },
  alarmContainer: { alignItems: "center", backgroundColor: "#E3F2FD", padding: 20 },
  alarmText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  addAlarmButton: { backgroundColor: "#1E90FF", padding: 10, borderRadius: 8 },
  addAlarmText: { color: "#fff", fontSize: 16 },
  reminderContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#E3F2FD", padding: 15 },
  timeText: { fontSize: 16, fontWeight: "bold" },
  labelText: { fontSize: 14, color: "#333" },
});
