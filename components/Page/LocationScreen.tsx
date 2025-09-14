import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import NameCard from "../compo/NameCard";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

interface LocationState {
  latitude: number;
  longitude: number;
}

interface AddressState {
  name?: string;
  street?: string;
  city?: string;
  region?: string;
}

export default function LocationScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState<LocationState | null>(null);
  const [address, setAddress] = useState<AddressState | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

      const newLocation = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setLocation(newLocation);
      setMapRegion({
        ...newLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Reverse Geocode to Get Address
      let addr = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (addr.length > 0) {
        setAddress(addr[0]);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      
      <NameCard />

      <Text style={styles.title}>Location</Text>

      {/* Google Map */}
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1976D2" />
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation
            showsMyLocationButton
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Your Location"
                description={address ? `${address.street}, ${address.city}` : "Current Location"}
              />
            )}
          </MapView>
        )}
      </View>

      {/* Location Display Cards */}
      <View style={styles.cardsContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B3D4FC",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976D2",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
});
