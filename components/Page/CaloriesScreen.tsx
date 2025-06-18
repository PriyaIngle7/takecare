import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CaloriesScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      detectFood(result.assets[0].uri);
    }
  };

  const detectFood = async (uri: string) => {
    setLoading(true);
    setLabels([]);
    const formData = new FormData();
    // @ts-ignore
    formData.append("image", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch("http://localhost:5000/detect-food", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await response.json();
      setLabels(data.labels || []);
    } catch (error) {
      setLabels(["Error detecting food"]);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Calories & Nutrition Detector</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Take a Photo of Food</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {labels.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Detected Food Items:</Text>
          {labels.map((label, idx) => (
            <Text key={idx} style={styles.resultText}>{label}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16 },
  image: { width: 250, height: 250, borderRadius: 10, marginVertical: 20 },
  resultBox: { marginTop: 20, backgroundColor: "#f0f0f0", padding: 15, borderRadius: 8, width: "100%" },
  resultTitle: { fontWeight: "bold", marginBottom: 10 },
  resultText: { fontSize: 16, marginBottom: 5 },
});
  