import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import ProfileSvg from "../../assets/images/profile";

const PatientInfoScreen = () => {
  const [formData, setFormData] = useState({
    healthRecord: "",
    diseaseHistory: "",
    yearsSuffering: "",
    symptoms: "",
    medications: "",
    allergies: "",
    lifestyle: "",
    familyHistory: "",
    smokingDrinking: "",
    physicalActivity: "",
    diet: "",
  });

  const [image, setImage] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error:", response.error);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ProfileSvg source={{ uri: "https://via.placeholder.com/40" }} style={styles.avatar} />
        <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
        <Text style={styles.userName}>John Doe</Text>
      </View>

      {/* Health Record Section */}
      <View style={styles.card}>
        <TextInput
          placeholder="Health record"
          value={formData.healthRecord}
          onChangeText={(text) => handleChange("healthRecord", text)}
          style={styles.input}
        />
      </View>

      {/* Questions Section */}
      {questions.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.questionText}>{item.question}</Text>
          <TextInput
            placeholder={item.placeholder}
            value={formData[item.key]}
            onChangeText={(text) => handleChange(item.key, text)}
            style={styles.input}
          />
        </View>
      ))}

      {/* Image Upload Section */}
      <View style={styles.card}>
        <Text style={styles.questionText}>Upload Medical Reports</Text>
        <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
      </View>
    </ScrollView>
  );
};


const questions = [
  { key: "diseaseHistory", question: "Do you have any past diseases?", placeholder: "Enter details" },
  { key: "yearsSuffering", question: "For how many years are you suffering?", placeholder: "Enter years" },
  { key: "symptoms", question: "What symptoms do you see?", placeholder: "Type symptoms" },
  { key: "upload", question: "Upload doctors report", placeholder: "List medications" },
  { key: "allergies", question: "Do you have any allergies?", placeholder: "Mention allergies" },
  { key: "lifestyle", question: "Describe your daily lifestyle", placeholder: "Lifestyle details" },
  { key: "smokingDrinking", question: "Do you smoke or drink?", placeholder: "Yes / No" },
  { key: "physicalActivity", question: "How often do you exercise?", placeholder: "Daily / Weekly / Never" },
  { key: "diet", question: "What kind of diet do you follow?", placeholder: "Vegetarian / Non-Vegetarian / Vegan" }
];


// upload medicine prescription,upload  doctor report,name of the diseas or symptoms  you are facing
//  How often do you exercise? , What kind of diet do you follow?, Do you smoke or drink?



const styles = {
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  userName: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#cce5ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
};

export default PatientInfoScreen;
