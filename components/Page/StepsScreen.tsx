import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import Toast from "react-native-toast-message";
import ProfileSVG from "../../assets/images/profile";

const screenWidth = Dimensions.get("window").width;

const StepTracker = () => {
  const [stepGoal, setStepGoal] = useState(5000);
  const [stepsTaken, setStepsTaken] = useState({});
  const [selectedDate] = useState(new Date());
  const [goalType, setGoalType] = useState("Daily");
  const [stepInput, setStepInput] = useState("");

  useEffect(() => {
    const formattedDate = selectedDate.toDateString();
    if (stepsTaken[formattedDate] >= stepGoal) {
      Toast.show({
        type: "success",
        text1: "Goal Achieved!",
        text2: `You have completed your ${goalType.toLowerCase()} step goal of ${stepGoal} steps! 🎉`,
      });
    }
  }, [stepGoal, selectedDate, stepsTaken]);

  const handleAddSteps = () => {
    const formattedDate = selectedDate.toDateString();
    if (formattedDate && stepInput) {
      setStepsTaken({ ...stepsTaken, [formattedDate]: parseInt(stepInput) || 0 });
      setStepInput("");
    }
  };

  const weeklyData = Object.values(stepsTaken);
  const weeklyLabels = Object.keys(stepsTaken);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <ProfileSVG style={styles.profileImage} />
        <View>
          <Text style={styles.profileWelcome}>Hi, Welcome Back</Text>
          <Text style={styles.profileName}>John Doe</Text>
        </View>
      </View>

      <Text style={styles.title}>Steps Tracker</Text>
      
      <View style={styles.goalSelection}>
        {["Daily", "Weekly", "Monthly"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.goalButton, goalType === type && styles.selectedGoal]}
            onPress={() => setGoalType(type)}
          >
            <Text style={styles.goalText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.subtitle}>Set Your Step Goal</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter step goal"
          value={stepGoal.toString()}
          onChangeText={(text) => setStepGoal(parseInt(text) || 0)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.subtitle}>Today's Date</Text>
        <Text style={styles.selectedDate}>{selectedDate.toDateString()}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter steps"
          value={stepInput}
          onChangeText={(text) => setStepInput(text)}
        />
        <Button title="Add Steps" onPress={handleAddSteps} />
      </View>

      {stepsTaken[selectedDate.toDateString()] !== undefined && (
        <PieChart
          data={[
            {
              name: "Completed",
              steps: Math.min(stepsTaken[selectedDate.toDateString()], stepGoal),
              color: "#4CAF50",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
            {
              name: "Remaining",
              steps: Math.max(stepGoal - (stepsTaken[selectedDate.toDateString()] || 0), 0),
              color: "#FFC107",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
          ]}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: "#FFF",
            backgroundGradientFrom: "#FFF",
            backgroundGradientTo: "#FFF",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="steps"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}

      {weeklyData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Weekly Steps Chart</Text>
          <LineChart
            data={{ labels: weeklyLabels, datasets: [{ data: weeklyData }] }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#FFF",
              backgroundGradientTo: "#FFF",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5,
            }}
            bezier
          />
        </View>
      )}

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#E3F2FD" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#1976D2" },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#0D47A1" },
  inputContainer: { marginTop: 20, padding: 15, backgroundColor: "#FFF", borderRadius: 10, elevation: 5 },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 5, padding: 10, marginBottom: 10 },
  goalSelection: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  goalButton: { padding: 10, margin: 5, borderRadius: 5, backgroundColor: "#90CAF9" },
  selectedGoal: { backgroundColor: "#1976D2" },
  goalText: { color: "#FFF", fontWeight: "bold" },
  selectedDate: { textAlign: "center", fontSize: 16, fontWeight: "bold", color: "#1976D2", marginVertical: 10 },
  chartContainer: { marginTop: 20, padding: 15, backgroundColor: "#FFF", borderRadius: 10, elevation: 5 },
  profileSection: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  profileWelcome: { fontSize: 16, color: "#0D47A1" },
  profileName: { fontSize: 18, fontWeight: "bold" },
});

export default StepTracker;
