import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F8FF", paddingTop: 40 }}>
      
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20 }}>
      <NotesImg width={80} height={40} borderRadius={20} marginRight={10} />
      
        <View>
          <Text style={{ fontSize: 14, color: "#555" }}>Hi, Welcome Back</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Harsh</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: "auto" }}>
          <TouchableOpacity style={{ marginRight: 10 }}>
          <NotesImg width={25} height={25} />

          </TouchableOpacity>
          <TouchableOpacity>
          <NotesImg width={25} height={25} />

          </TouchableOpacity>
        </View>
      </View>

      
      <View style={{ margin: 20, backgroundColor: "#E6F0FF", height: 200, borderRadius: 15, padding: 15 }}>
        <Text style={{ fontSize: 16, color: "#555" }}>...</Text>
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
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Features;
