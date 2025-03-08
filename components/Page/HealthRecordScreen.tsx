import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import ProfileSvg from "../../assets/images/profile";
import NameCard from "../compo/NameCard";

const PatientInfoScreen = () => {
  const [formData, setFormData] = useState({
    diseaseHistory: "",
    yearsSuffering: "",
    symptoms: "",
    allergies: "",
    lifestyle: "",
    smokingDrinking: "",
    physicalActivity: "",
    diet: "",
  });

  const [imageData, setImageData] = useState({
    prescription: null,
    doctorReport: null,
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleImageUpload = (type) => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error:", response.error);
      } else if (response.assets && response.assets.length > 0) {
        setImageData((prev) => ({ ...prev, [type]: response.assets[0].uri }));
      }
    });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
    

      {/* Name Card */}
      <NameCard name="John Doe" />

      {/* Input Fields */}
      {questions.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.questionText}>{item.question}</Text>
          {item.type === "upload" ? (
            <TouchableOpacity onPress={() => handleImageUpload(item.key)} style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              placeholder={item.placeholder}
              value={formData[item.key]}
              onChangeText={(text) => handleChange(item.key, text)}
              style={styles.input}
            />
          )}
          {item.type === "upload" && imageData[item.key] && (
            <Image source={{ uri: imageData[item.key] }} style={styles.uploadedImage} />
          )}
        </View>
      ))}
    </ScrollView>
  );
};


const questions = [
  { key: "diseaseHistory", question: "Name of the disease or symptoms you are facing", placeholder: "Enter details", type: "text" },
  { key: "yearsSuffering", question: "For how many years are you suffering?", placeholder: "Enter years", type: "text" },
  { key: "symptoms", question: "What symptoms do you see?", placeholder: "Type symptoms", type: "text" },
  { key: "prescription", question: "Upload medicine prescription", placeholder: "Upload file", type: "upload" },
  { key: "doctorReport", question: "Upload doctor's report", placeholder: "Upload file", type: "upload" },
  { key: "allergies", question: "Do you have any allergies?", placeholder: "Mention allergies", type: "text" },
  { key: "lifestyle", question: "Describe your daily lifestyle", placeholder: "Lifestyle details", type: "text" },
  { key: "smokingDrinking", question: "Do you smoke or drink?", placeholder: "Yes / No", type: "text" },
  { key: "physicalActivity", question: "How often do you exercise?", placeholder: "Daily / Weekly / Never", type: "text" },
  { key: "diet", question: "What kind of diet do you follow?", placeholder: "Vegetarian / Non-Vegetarian / Vegan", type: "text" }
];

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
  headerText: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  userName: {
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

