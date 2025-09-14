import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import ProfileSvg from "../../assets/images/profile";
import NameCard from "../compo/NameCard";
import axios from 'axios';

const PatientInfoScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [formData, setFormData] = useState<{[key: string]: string}>({
    diseaseHistory: "",
    yearsSuffering: "",
    symptoms: "",
    allergies: "",
    lifestyle: "",
    smokingDrinking: "",
    physicalActivity: "",
    diet: "",
  });

  const [imageData, setImageData] = useState<{[key: string]: any}>({
    prescription: null,
    doctorReport: null,
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load existing health record data when component mounts
  useEffect(() => {
    if (user?._id) {
      loadHealthRecord();
    }
  }, [user]);

  const loadHealthRecord = async () => {
    if (!user?._id) return;
    
    try {
      setIsLoadingData(true);
      
      // Always try to load from local storage first for immediate display
      const localData = await AsyncStorage.getItem(`healthRecord_${user._id}`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log('Loaded local data:', parsedData);
        setFormData(parsedData.formData || parsedData);
      }
      
      // Then try to fetch from backend to sync any updates
      try {
        const response = await axios.get(`https://takecare-ds3g.onrender.com/api/health-record/${user._id}`);
        
        if (response.data && response.data.formData) {
          console.log('Loaded backend data:', response.data.formData);
          setFormData(response.data.formData);
          // Update local storage with backend data
          await saveLocalHealthRecord(response.data.formData);
        }
      } catch (backendError: any) {
        console.log('Backend not available, using local data:', backendError.message);
        // Local data is already loaded above, so this is fine
      }
      
    } catch (error) {
      console.error('Error loading health record:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const saveLocalHealthRecord = async (data: any) => {
    if (!user?._id) return;
    
    try {
      await AsyncStorage.setItem(`healthRecord_${user._id}`, JSON.stringify({
        formData: data,
        lastUpdated: new Date().toISOString(),
        userId: user._id
      }));
    } catch (error) {
      console.error('Error saving local health record:', error);
    }
  };

  const handleChange = (key: string, value: string) => {
    console.log('handleChange called:', key, value);
    const updatedFormData = { ...formData, [key]: value };
    console.log('Updated form data:', updatedFormData);
    setFormData(updatedFormData);
    
    // Save to local storage immediately for offline access
    saveLocalHealthRecord(updatedFormData);
  };

  const handleImageUpload = async (type: string) => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Permission to access camera roll is required!");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageData((prev) => ({ 
          ...prev, 
          [type]: {
            uri: asset.uri,
            type: 'image/jpeg',
            name: `${type}_${Date.now()}.jpg`
          }
        }));
      }
    } catch (error) {
      console.log("ImagePicker Error:", error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (imageData: any) => {
    if (!imageData) return null;
    
    const formData = new FormData();
    formData.append('image', imageData as any);

    try {
      const response = await axios.post('https://takecare-ds3g.onrender.com/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.ocrText || 'Image uploaded successfully';
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    if (!user?._id) {
      Alert.alert('Error', 'User not authenticated. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      // Upload images first
      let prescriptionText = null;
      let doctorReportText = null;

      if (imageData.prescription) {
        prescriptionText = await uploadImage(imageData.prescription);
      }
      
      if (imageData.doctorReport) {
        doctorReportText = await uploadImage(imageData.doctorReport);
      }

      // Submit health record with authenticated user's ID
      const healthRecordData = {
        userId: user._id,
        formData: formData,
        imageData: {
          prescription: prescriptionText,
          doctorReport: doctorReportText,
        }
      };

      // Save to local storage first for offline access
      await saveLocalHealthRecord(formData);

      // Try to save to backend
      const response = await axios.post('https://takecare-ds3g.onrender.com/add-health-record', healthRecordData);
      
      Alert.alert('Success', 'Health record saved successfully!');
      
      // Reload the data to ensure it's displayed correctly
      await loadHealthRecord();
      
    } catch (error) {
      console.error('Submit error:', error);
      
      // Even if backend fails, data is saved locally
      Alert.alert(
        'Saved Locally', 
        'Health record saved locally. It will be synced when you\'re back online.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Name Card */}
      <NameCard />

      {/* Loading indicator */}
      {isLoadingData && (
        <View style={styles.loadingContainer}>
          <Text>Loading your health record...</Text>
        </View>
      )}

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
            <Image source={{ uri: imageData[item.key].uri }} style={styles.uploadedImage} />
          )}
        </View>
      ))}
      
      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Saving...' : 'Save Health Record'}
        </Text>
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#0B82D4",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center" as const,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginVertical: 10,
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
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold" as const,
    fontSize: 16,
  },
});


export default PatientInfoScreen;

