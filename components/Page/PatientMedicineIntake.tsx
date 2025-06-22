import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { PieChart } from 'react-native-chart-kit';
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const scale = width / 320;

type RootStackParamList = {
  PatientMedicineIntake: {
    patientId: string;
    patientName: string;
  };
};

type PatientMedicineIntakeRouteProp = RouteProp<RootStackParamList, 'PatientMedicineIntake'>;

export default function PatientMedicineIntake() {
  const navigation = useNavigation();
  const route = useRoute<PatientMedicineIntakeRouteProp>();
  const { user } = useAuth();
  const { patientId, patientName } = route.params;
  
  const [logs, setLogs] = useState<{ date: string; response: string }[]>([]);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id && patientId) {
      fetchPatientMedicineIntake();
    }
  }, [user, patientId]);

  const fetchPatientMedicineIntake = async () => {
    if (!user?._id) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://takecare-ds3g.onrender.com/api/caretaker/patient-medicine-intake/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }

      const data = await response.json();
      
      // Format the data for display
      const formattedLogs = data.records.map((log: any) => ({
        date: log.date,
        response: log.response
      }));
      
      setLogs(formattedLogs);
      setYesCount(data.stats.taken);
      setNoCount(data.stats.missed);
    } catch (error) {
      console.error("Error fetching patient medicine intake:", error);
      setError("Failed to load patient data");
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading patient data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPatientMedicineIntake}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24 * scale} color="#0B82D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Medicine Intake</Text>
        <View style={{ width: 24 * scale }} />
      </View>

      {/* Patient Info */}
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{patientName}</Text>
        <Text style={styles.patientSubtitle}>Medicine Intake Report</Text>
      </View>

      {/* Compliance Rate */}
      <View style={styles.complianceContainer}>
        <Text style={styles.complianceTitle}>Compliance Rate</Text>
        <Text style={styles.complianceRate}>{complianceRate}%</Text>
        <Text style={styles.complianceSubtitle}>
          {yesCount} taken, {noCount} missed
        </Text>
      </View>

      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={width - 60}
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

      {/* Recent Responses */}
      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Recent Responses</Text>
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logDate}>
                {new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString()}
              </Text>
              <Text style={[
                styles.logResponse,
                { color: log.response === 'Yes' ? '#4CAF50' : '#FF5252' }
              ]}>
                {log.response}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No medicine intake records found</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FF",
  },
  loadingText: {
    fontSize: 16 * scale,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FF",
    padding: 20 * scale,
  },
  errorText: {
    fontSize: 16 * scale,
    color: "#FF5252",
    textAlign: "center",
    marginBottom: 20 * scale,
  },
  retryButton: {
    backgroundColor: "#0B82D4",
    paddingHorizontal: 20 * scale,
    paddingVertical: 10 * scale,
    borderRadius: 8 * scale,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14 * scale,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20 * scale,
    paddingVertical: 15 * scale,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18 * scale,
    fontWeight: "bold",
    color: "#333",
  },
  patientInfo: {
    alignItems: "center",
    paddingVertical: 20 * scale,
    backgroundColor: "#fff",
    marginBottom: 10 * scale,
  },
  patientName: {
    fontSize: 24 * scale,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5 * scale,
  },
  patientSubtitle: {
    fontSize: 16 * scale,
    color: "#666",
  },
  complianceContainer: {
    alignItems: "center",
    paddingVertical: 20 * scale,
    backgroundColor: "#fff",
    marginBottom: 10 * scale,
  },
  complianceTitle: {
    fontSize: 16 * scale,
    color: "#666",
    marginBottom: 5 * scale,
  },
  complianceRate: {
    fontSize: 36 * scale,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5 * scale,
  },
  complianceSubtitle: {
    fontSize: 14 * scale,
    color: "#999",
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: 20 * scale,
    backgroundColor: "#fff",
    marginBottom: 10 * scale,
  },
  logsContainer: {
    backgroundColor: "#fff",
    padding: 20 * scale,
  },
  logsTitle: {
    fontSize: 18 * scale,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15 * scale,
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10 * scale,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  logDate: {
    fontSize: 14 * scale,
    color: "#666",
    flex: 1,
  },
  logResponse: {
    fontSize: 16 * scale,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16 * scale,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
}); 