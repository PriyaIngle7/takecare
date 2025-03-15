import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Location from "expo-location";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest, // Ensures the most precise location
      });

      setLocation(loc.coords);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Get Location" onPress={getLocation} />
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location && (
        <Text>
          Latitude: {location.latitude} {"\n"}
          Longitude: {location.longitude} {"\n"}
          Accuracy: {location.accuracy} meters
        </Text>
      )}
    </View>
  );
}
