import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import NameCard from "../compo/NameCard";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to fetch address.");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLocation(loc.coords);

      // Reverse Geocode to Get Address
      let addr = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (addr.length > 0) {
        setAddress(addr[0]); // Get the first result
      }
    } catch (error:any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#B3D4FC", padding: 20 }}>
      <NameCard />

      <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Location
      </Text>

      {/* Map Placeholder */}
      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "#E0E0E0",
          borderRadius: 10,
          marginBottom: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? <ActivityIndicator size="large" color="#1976D2" /> : <Text style={{ color: "#555" }}>Map Placeholder</Text>}
      </View>

      {/* Location Display Cards */}
      <View 
      style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <TouchableOpacity style={styles.card} onPress={getLocation}>
          <Text style={styles.cardText}>
            {location
              ? `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`
              : "Get Location"}
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            {address
              ? `${address.name || ""}, ${address.street || ""}, ${address.city}, ${address.region}`
              : "Address"}
          </Text>
        </View>
      </View>
      
    </View>
  );
}

const styles = {
  card: {
    flex: 1,
    backgroundColor: "#1976D2",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  cardText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
};
