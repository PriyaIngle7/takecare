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
import { PieChart } from 'react-native-chart-kit';

export default function ActivityScreen() {
  const navigation = useNavigation();
  const [response, setResponse] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ date: string; response: string }[]>([]);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLogs();
    }
  }, [userId]);

  const loadUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { _id } = JSON.parse(userData);
        setUserId(_id);
      }
    } catch (error) {
      console.error("Error loading user ID:", error);
    }
  };

  // Fetch past responses from backend
  const fetchLogs = async () => {
    if (!userId) return;

    try {
      // Fetch medicine intake history
      const res = await fetch(`https://takecare-ds3g.onrender.com/api/medicine-intake/${userId}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      // Format the data for display
      const formattedLogs = data.map((log: any) => ({
        date: log.date,
        response: log.response
      }));
      
      setLogs(formattedLogs);

      // Fetch statistics
      const statsRes = await fetch(`https://takecare-ds3g.onrender.com/api/medicine-intake/stats/${userId}`);
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
      const localLogs = await AsyncStorage.getItem('medicineIntakeLogs');
      if (localLogs) {
        const parsedLogs = JSON.parse(localLogs);
        setLogs(parsedLogs);
        countResponses(parsedLogs);
      }
    } catch (error) {
      console.error("Error loading local data:", error);
    }
  };

  // Save data to local storage
  const saveLocalData = async (newLogs: { date: string; response: string }[]) => {
    try {
      await AsyncStorage.setItem('medicineIntakeLogs', JSON.stringify(newLogs));
    } catch (error) {
      console.error("Error saving local data:", error);
    }
  };

  // Count Yes/No responses
  const countResponses = (data: { response: string }[]) => {
    const yes = data.filter((log) => log.response === "Yes").length;
    const no = data.filter((log) => log.response === "No").length;
    setYesCount(yes);
    setNoCount(no);
  };

  // Send response to backend
  const handleResponse = async (answer: string) => {
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }

    setResponse(answer);
    const newLog = { date: new Date().toISOString(), response: answer };
    const updatedLogs = [newLog, ...logs];
    
    // Update local state immediately
    setLogs(updatedLogs);
    countResponses(updatedLogs);
    saveLocalData(updatedLogs);

    try {
      const res = await fetch("https://takecare-ds3g.onrender.com/api/medicine-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId,
          response: answer,
          notes: "Medicine intake response"
        }),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      setIsOnline(true);
    } catch (error) {
      console.error("Error saving response:", error);
      setIsOnline(false);
      Alert.alert(
        "Offline Mode",
        "Your response has been saved locally. It will be synced when you're back online.",
        [{ text: "OK" }]
      );
    }
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

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
        <Text style={styles.headerText}>BEN</Text>
        <Text style={[styles.onlineStatus, { color: isOnline ? 'green' : 'red' }]}>
          • {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>

      {/* Chat Message */}
      <View style={styles.chatContainer}>
        <Image source={{ uri: "https://your-bot-image-url.com" }} style={styles.botImage} />
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>Have you taken medicines?</Text>
        </View>
      </View>

      {/* Response Buttons */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, response === "Yes" && styles.selected]}
          onPress={() => handleResponse("Yes")}
        >
          <Text style={styles.optionText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, response === "No" && styles.selected]}
          onPress={() => handleResponse("No")}
        >
          <Text style={styles.optionText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Medicine Intake Report */}
      <View style={styles.reportContainer}>
        <Text style={styles.chartTitle}>Medicine Intake Report</Text>
        
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
  onlineStatus: { marginLeft: 5 },
  chatContainer: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  botImage: { width: 50, height: 50 },
  messageBubble: { backgroundColor: "#007AFF", padding: 10, borderRadius: 15, marginLeft: 10 },
  messageText: { color: "white", fontSize: 16 },
  optionsContainer: { marginTop: 20, flexDirection: "row", justifyContent: "space-around" },
  optionButton: { backgroundColor: "#F5F5F5", padding: 10, borderRadius: 10, minWidth: 80, alignItems: "center" },
  selected: { backgroundColor: "#4CAF50" },
  optionText: { fontSize: 16, fontWeight: "bold" },
  reportContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: 15,
    color: '#333',
  },
  complianceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  complianceTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  complianceRate: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logHeader: { 
    marginTop: 20, 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#333',
  },
  logText: { 
    fontSize: 16, 
    color: "#666", 
    marginTop: 5,
    paddingVertical: 3,
  },
});


