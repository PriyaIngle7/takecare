import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, Image } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default function MedicineMonitoringScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back); // ✅ Corrected Usage

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo.uri);
        setIsCameraOpen(false);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cameraContainer} onPress={() => setIsCameraOpen(true)}>
        <Ionicons name="camera-outline" size={50} color="white" />
        <Text style={styles.cameraText}>Tap to Open Camera</Text>
      </TouchableOpacity>

      <Modal visible={isCameraOpen} animationType="slide">
        <View style={styles.cameraModal}>
          {isCameraOpen && (
            <Camera
              ref={(ref) => (cameraRef.current = ref!)}
              style={styles.cameraView}
              type={type} // ✅ No more undefined error
            >
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Ionicons name="camera" size={50} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeCamera} onPress={() => setIsCameraOpen(false)}>
                <Ionicons name="close-circle" size={40} color="white" />
              </TouchableOpacity>
            </Camera>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  cameraContainer: {
    backgroundColor: "black",
    height: 200,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  cameraText: { color: "white", fontSize: 16, marginTop: 5 },
  cameraModal: { flex: 1, backgroundColor: "black", justifyContent: "center" },
  cameraView: { flex: 1, width: "100%" },
  closeCamera: { position: "absolute", top: 40, right: 20 },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 50,
  },
});
