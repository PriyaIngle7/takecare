import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import NameCard from '../compo/NameCard';

export default function MedicineGuideScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState(''); // OCR result or status

  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission denied', 'We need access to your gallery to pick an image.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setMedicineInfo('Extracting medicine details...');
      uploadImage(uri);
    } else {
      setMedicineInfo('Image selection cancelled');
    }
  };

  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg', // why? type is defined only for jpeg 
      name: 'medicine.jpg',
    } as any);

    try {
      const response = await axios.post('https://takecare-ds3g.onrender.com/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.ocrText) {
        setMedicineInfo(response.data.ocrText);
      } else {
        setMedicineInfo('No text detected');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMedicineInfo('Failed to extract text');
    }
  };

  return (
    <View style={styles.container}>
      <NameCard />

      <View style={styles.uploadBox}>
        <Text style={styles.uploadText}>Medicine Monitoring</Text>
      </View>

      <View style={styles.uploadContainer}>
        <Text style={styles.uploadLabel}>Upload your report</Text>
        <Button mode="contained" onPress={pickImage}>
          Select Image
        </Button>
      </View>

      <View style={styles.resultContainer}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        <Text style={styles.resultText}>{medicineInfo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FB',
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
