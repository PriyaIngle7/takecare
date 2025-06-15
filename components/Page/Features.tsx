import React, { useEffect, useState} from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import AlarmImg from "../../assets/images/alarm";
import ActivityImg from "../../assets/images/activity";
import NotesImg from "../../assets/images/notes";
import LocationImg from "../../assets/images/location";
import CaloriesImg from "../../assets/images/calories";
import MedicineGuideImg from "../../assets/images/medicineguide";
import StepsImg from "../../assets/images/steps";
import MedicineMonitoringImg from "../../assets/images/medicinemonitoring";
import ExerciseClipsImg from "../../assets/images/exerciseclips";
import HealthRecordImg from "../../assets/images/healthrecord";
import NameCard from "../compo/NameCard";
import ProfileScreen from "./Profile";
const scale = width / 320;
type RootStackParamList = {
  AlarmScreen: undefined;
  ActivityScreen: undefined;
  NotesScreen: undefined;
  LocationScreen: undefined;
  CaloriesScreen: undefined;
  MedicineGuideScreen: undefined;
  StepsScreen: undefined;
  MedicineMonitoringScreen: undefined;
  ExerciseClipsScreen: undefined;
  HealthRecordScreen: undefined;
  UserList: undefined;
};

const features = [
  { title: "Alarm", image: AlarmImg, screen: "AlarmScreen" },
  { title: "Activity Monitoring", image: ActivityImg, screen: "ActivityScreen" },
  { title: "Your Notes", image: NotesImg, screen: "NotesScreen" },
  { title: "Location", image: LocationImg, screen: "LocationScreen" },
  { title: "Calories", image: CaloriesImg, screen: "CaloriesScreen" },
  { title: "Medicine Guide", image: MedicineGuideImg, screen: "MedicineGuideScreen" },
  { title: "Steps", image: StepsImg, screen: "StepsScreen" },
  { title: "Medicine Monitoring", image: MedicineMonitoringImg, screen: "MedicineMonitoringScreen" },
  { title: "Exercise Clips", image: ExerciseClipsImg, screen: "ExerciseClipsScreen" },
  { title: "Health Record", image: HealthRecordImg, screen: "HealthRecordScreen" },
];

const Features = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isCaretaker, setIsCaretaker] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setIsCaretaker(user.role === "caretaker");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F8FF", paddingTop: 40 }}>
      <NameCard/>
      <View style={{ margin: 20, backgroundColor: "#E6F0FF", height: 200, borderRadius: 15, padding: 15 }}>
        <TouchableOpacity style={{ backgroundColor: "#0057FF", padding: 10, borderRadius: 10, width: 100, marginTop: 20 }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Start</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
          {features.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: "45%",
                backgroundColor: "#E6F0FF",
                borderRadius: 15,
                padding: 15,
                alignItems: "center",
                marginBottom: 15,
              }}
              onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}
            >
              <item.image width={100} height={100}/>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" ,backgroundColor: "#fff",borderRadius: 10,padding: 10,marginTop:10,textAlign:"center" }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isCaretaker && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("UserList")}
        >
          <AntDesign name="team" size={28 * scale} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#0B82D4',
    width: 56*scale,
    height: 56*scale,
    borderRadius: 28*scale,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
