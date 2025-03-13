import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import NameCard from "../compo/NameCard";
import CameraSVG from "@/assets/images/camer";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button } from "react-native-paper";

const { width } = Dimensions.get("window");
const scale = 320 / width;

const MedicineMonitoringScreen = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) =>
      current === "back" ? "front" : "back"
    );
  }

  return (
    <View style={styles.container}>
      <NameCard />

      <View style={styles.box}>
        <View style={styles.innerBox}>
          <View style={styles.textBox}>
            <Text>Medicine Monitoring</Text>
          </View>
          <TouchableOpacity onPress={toggleCameraFacing}>
            <CameraSVG />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text>Monitor your medicine time</Text>
      </View>

      {/* ✅ CameraView with fixed height */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} />
      </View>
    </View>
  );
};

export default MedicineMonitoringScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: "#a7cfec",
    marginHorizontal: 20 * scale,
    paddingHorizontal: 30 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 10 * scale,
  },
  innerBox: {
    backgroundColor: "#0b82d4",
    flexDirection: "row",
    marginHorizontal: 20 * scale,
    paddingHorizontal: 30 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 10 * scale,
  },
  textBox: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20 * scale,
    paddingHorizontal: 30 * scale,
    paddingVertical: 20 * scale,
    borderRadius: 10 * scale,
  },
  infoBox: {
    backgroundColor: "#89c1ea",
    paddingHorizontal: 30 * scale,
    marginHorizontal: 20 * scale,
    borderRadius: 10 * scale,
    paddingVertical: 20 * scale,
    marginVertical: 30 * scale,
  },
  cameraContainer: {
    flex: 1, // Ensures the camera takes available space
    height: 500, // ✅ Give explicit height for CameraView to render
  },
  camera: {
    flex: 1,
  },
});
