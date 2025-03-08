import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import ProfileSvg from "../../assets/images/profile";
import NameCard from "../compo/NameCard";

const LocationScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ProfileSvg source={{ uri: "https://via.placeholder.com/40" }} style={styles.avatar} />
        <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
        <Text style={styles.userName}>John Doe</Text>
      </View>

      {/* Location Title */}
      <Text style={styles.title}>Location</Text>

      {/* Placeholder for Map */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map Preview Here</Text>
      </View>

      {/* Location Details */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Last location: Pune</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Another Option</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#cce5ff",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  userName: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mapPlaceholder: {
    width: "90%",
    height: 200,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  mapText: {
    fontSize: 16,
    color: "#666",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  card: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LocationScreen;
