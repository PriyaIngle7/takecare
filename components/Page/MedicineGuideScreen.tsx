import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';

export default function MedicineGuideScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState('');

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets?.[0]?.uri) {
        setImageUri(response.assets[0].uri);
        setMedicineInfo('Extracting medicine details...'); // Placeholder for OCR processing
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hi, Welcome back</Text>
      <Text style={styles.username}>John Doe</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        <Text style={styles.uploadText}>medicine monitoring</Text>
      </TouchableOpacity>

      <View style={styles.uploadContainer}>
        <Text style={styles.uploadLabel}>Upload your report</Text>
        <Button mode="contained" onPress={pickImage}>Select Image</Button>
      </View>

      <View style={styles.resultContainer}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        <Text style={styles.resultText}>{medicineInfo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FB',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    marginBottom: 20,
  },
  uploadBox: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    color: '#FFF',
    fontSize: 16,
  },
  uploadContainer: {
    backgroundColor: '#B0D4FF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  resultContainer: {
    backgroundColor: '#DCE6F1',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
});