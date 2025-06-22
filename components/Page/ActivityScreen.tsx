import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/contexts/AuthContext";
import { usePatient } from "@/contexts/PatientContext";
import { PieChart } from 'react-native-chart-kit';

export default function ActivityScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { selectedPatient, isViewingPatient } = usePatient();
  const [response, setResponse] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ date: string; response: string }[]>([]);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Determine which user's data to show
  const targetUserId = isViewingPatient ? selectedPatient?._id : user?._id;
  const targetUserName = isViewingPatient ? selectedPatient?.name : user?.name;

  // Check if current user is a caretaker viewing their own data
  const isCaretakerViewingOwnData = user?.role === 'caretaker' && !isViewingPatient;

  useEffect(() => {
    // If caretaker is trying to view their own data, redirect to Features
    if (isCaretakerViewingOwnData) {
      Alert.alert(
        "Caretaker Mode",
        "Caretakers can only view patient records. Please select a patient to view their medicine intake.",
        [
          {
            text: "Go to Patients",
            onPress: () => navigation.navigate("UserList" as never)
          }
        ]
      );
      return;
    }

    if (targetUserId) {
      fetchLogs();
    }
  }, [targetUserId, isCaretakerViewingOwnData]);

  // Fetch past responses from backend
  const fetchLogs = async () => {
    if (!targetUserId) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    try {
      // Fetch medicine intake history for target user
      const res = await fetch(`https://takecare-ds3g.onrender.com/api/medicine-intake/${targetUserId}`);

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      // Format the data for display
      const formattedLogs = data.map((log: any) => ({
        date: log.date,
        response: log.response
      }));
      
      setLogs(formattedLogs);

      // Fetch statistics for target user
      const statsRes = await fetch(`https://takecare-ds3g.onrender.com/api/medicine-intake/stats/${targetUserId}`);
      if (!statsRes.ok) throw new Error('Network response was not ok');
      const stats = await statsRes.json();
      
      setYesCount(stats.taken);
      setNoCount(stats.missed);
      setIsOnline(true);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setIsOnline(false);
      // If offline, use local data
      loadLocalData();
    }
  };

  // Load data from local storage
  const loadLocalData = async () => {
    try {
      const localLogs = await AsyncStorage.getItem(`medicineIntakeLogs_${targetUserId}`);
      if (localLogs) {
        const parsedLogs = JSON.parse(localLogs);
        setLogs(parsedLogs);
        
        // Calculate statistics from local data
        const yes = parsedLogs.filter((log: any) => log.response === "Yes").length;
        const no = parsedLogs.filter((log: any) => log.response === "No").length;
        setYesCount(yes);
        setNoCount(no);
      }
    } catch (error) {
      console.error("Error loading local data:", error);
    }
  };

  // Save data to local storage
  const saveLocalData = async (newLogs: { date: string; response: string }[]) => {
    try {
      await AsyncStorage.setItem(`medicineIntakeLogs_${targetUserId}`, JSON.stringify(newLogs));
    } catch (error) {
      console.error("Error saving local data:", error);
    }
  };

  // Send response to backend
  const handleResponse = async (answer: string) => {
    if (!targetUserId) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    // Prevent caretakers from adding responses (either for themselves or patients)
    if (user?.role === 'caretaker') {
      Alert.alert("Caretaker Mode", "Caretakers cannot add medicine intake responses. Only patients can record their medicine intake.");
      return;
    }

    if (isSaving) return; // Prevent multiple submissions

    setIsSaving(true);
    setResponse(answer);
    const newLog = { date: new Date().toISOString(), response: answer };
    const updatedLogs = [newLog, ...logs];
    
    // Update local state immediately for UI responsiveness
    setLogs(updatedLogs);
    saveLocalData(updatedLogs);

    try {
      const res = await fetch("https://takecare-ds3g.onrender.com/api/medicine-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: targetUserId,
          response: answer,
          notes: "Medicine intake response"
        }),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      
      // After successful backend save, update the statistics
      setIsOnline(true);
      
      // Recalculate statistics from the updated logs
      const yes = updatedLogs.filter((log) => log.response === "Yes").length;
      const no = updatedLogs.filter((log) => log.response === "No").length;
      setYesCount(yes);
      setNoCount(no);
      
    } catch (error) {
      console.error("Error saving response:", error);
      setIsOnline(false);
      
      // Revert the local state if backend save failed
      setLogs(logs);
      setResponse(null);
      
      Alert.alert(
        "Offline Mode",
        "Your response has been saved locally. It will be synced when you're back online.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Show message for caretakers viewing their own data
  if (isCaretakerViewingOwnData) {
    return (
      <View style={styles.caretakerMessageContainer}>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s" }}
          style={styles.caretakerAvatar}
        />
        <Text style={styles.caretakerTitle}>Caretaker Dashboard</Text>
        <Text style={styles.caretakerMessage}>
          As a caretaker, you can only view patient records. Please select a patient to view their medicine intake data.
        </Text>
        <TouchableOpacity
          style={styles.selectPatientButton}
          onPress={() => navigation.navigate("UserList" as never)}
        >
          <Text style={styles.selectPatientButtonText}>Select Patient</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalResponses = yesCount + noCount;
  const complianceRate = totalResponses > 0 ? Math.round((yesCount / totalResponses) * 100) : 0;

  const chartData = [
    {
      name: "Taken",
      population: yesCount,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Missed",
      population: noCount,
      color: "#FF5252",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s" }}
          style={styles.avatar}
        />
        <Text style={styles.headerText}>{targetUserName || "User"}</Text>
        <Text style={[styles.onlineStatus, { color: isOnline ? 'green' : 'red' }]}>
          • {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>

      {/* Chat Message */}
      <View style={styles.chatContainer}>
        <Image source={{ uri: "https://your-bot-image-url.com" }} style={styles.botImage} />
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            {isViewingPatient 
              ? `Has ${targetUserName} taken medicines?` 
              : "Have you taken medicines?"
            }
          </Text>
        </View>
      </View>

      {/* Response Buttons - Only show for patients, not for caretakers */}
      {user?.role === 'patient' && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton, 
              response === "Yes" && styles.selected,
              isSaving && styles.disabled
            ]}
            onPress={() => handleResponse("Yes")}
            disabled={isSaving}
          >
            <Text style={[
              styles.optionText,
              isSaving && styles.disabledText
            ]}>
              {isSaving && response === "Yes" ? "Saving..." : "Yes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton, 
              response === "No" && styles.selected,
              isSaving && styles.disabled
            ]}
            onPress={() => handleResponse("No")}
            disabled={isSaving}
          >
            <Text style={[
              styles.optionText,
              isSaving && styles.disabledText
            ]}>
              {isSaving && response === "No" ? "Saving..." : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Medicine Intake Report */}
      <View style={styles.reportContainer}>
        <Text style={styles.chartTitle}>
          {isViewingPatient ? `${targetUserName}'s Medicine Intake Report` : "Medicine Intake Report"}
        </Text>
        
        {/* Compliance Rate */}
        <View style={styles.complianceContainer}>
          <Text style={styles.complianceTitle}>Compliance Rate</Text>
          <Text style={styles.complianceRate}>{complianceRate}%</Text>
        </View>

        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 60}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Previous Logs */}
        <Text style={styles.logHeader}>Previous Responses:</Text>
        {logs.slice(0, 5).map((log, index) => (
          <Text key={index} style={styles.logText}>
            {new Date(log.date).toLocaleString()}: {log.response}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E3F2FD", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#D3D3D3" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerText: { fontSize: 18, fontWeight: "bold" },
  onlineStatus: { marginLeft: "auto", fontSize: 14 },
  chatContainer: { flexDirection: "row", marginVertical: 20, alignItems: "flex-start" },
  botImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  messageBubble: { 
    backgroundColor: "#FFFFFF", 
    padding: 15, 
    borderRadius: 20, 
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  messageText: { fontSize: 16, color: "#333" },
  optionsContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  optionButton: { 
    backgroundColor: "#FFFFFF", 
    padding: 15, 
    borderRadius: 10, 
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  selected: { backgroundColor: "#4CAF50" },
  disabled: { opacity: 0.6 },
  optionText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  selectedText: { color: "#FFFFFF" },
  disabledText: { color: "#999" },
  reportContainer: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 15, marginTop: 20 },
  chartTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  complianceContainer: { alignItems: "center", marginBottom: 20 },
  complianceTitle: { fontSize: 14, color: "#666", marginBottom: 5 },
  complianceRate: { fontSize: 24, fontWeight: "bold", color: "#4CAF50" },
  chartContainer: { alignItems: "center", marginBottom: 20 },
  logHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  logText: { fontSize: 14, color: "#666", marginBottom: 5 },
  // New styles for caretaker message
  caretakerMessageContainer: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  caretakerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  caretakerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  caretakerMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  selectPatientButton: {
    backgroundColor: "#0B82D4",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  selectPatientButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


