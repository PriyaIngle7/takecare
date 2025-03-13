import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";

export default function ActivityScreen() {
  const navigation = useNavigation();
  const [response, setResponse] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ date: string; answer: string }[]>([]);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem("medicine_logs");
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
        countResponses(parsedLogs);
      }
    } catch (error) {
      console.error("Error loading logs:", error);
    }
  };

  const countResponses = (data: { answer: string }[]) => {
    const yes = data.filter((log) => log.answer === "Yes").length;
    const no = data.filter((log) => log.answer === "No").length;
    setYesCount(yes);
    setNoCount(no);
  };

  const handleResponse = async (answer: string) => {
    setResponse(answer);
    const newLog = { date: new Date().toLocaleString(), answer };
    const updatedLogs = [...logs, newLog];

    setLogs(updatedLogs);
    countResponses(updatedLogs);

    // Save logs to AsyncStorage
    try {
      await AsyncStorage.setItem("medicine_logs", JSON.stringify(updatedLogs));
    } catch (error) {
      console.error("Error saving logs:", error);
    }

    // Navigate back after a delay
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s" }}
          style={styles.avatar}
        />
        <Text style={styles.headerText}>BEN</Text>
        <Text style={styles.onlineStatus}>• Online</Text>
      </View>

      {/* Chat Message */}
      <View style={styles.chatContainer}>
        <Image
          source={{ uri: "https://your-bot-image-url.com" }}
          style={styles.botImage}
        />
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

      {/* Previous Logs */}
      <Text style={styles.logHeader}>Previous Responses:</Text>
      {logs.slice(-5).map((log, index) => (
        <Text key={index} style={styles.logText}>
          {log.date}: {log.answer}
        </Text>
      ))}

      {/* Graph */}
      <Text style={styles.chartTitle}>Medicine Intake Report</Text>
      <BarChart
        data={{
          labels: ["Yes", "No"],
          datasets: [{ data: [yesCount, noCount] }],
        }}
        width={350}
        height={200}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  onlineStatus: {
    color: "green",
    marginLeft: 5,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  botImage: {
    width: 50,
    height: 50,
  },
  messageBubble: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 15,
    marginLeft: 10,
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionButton: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#4CAF50",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  logText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  chartTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  chart: {
    marginTop: 10,
    alignSelf: "center",
  },
});
