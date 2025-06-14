import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Icon } from "react-native-elements";
import ProfileSVG from "../../assets/images/profile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const renderProfileItem = (
    iconName: string,
    label: string,
    keyName: string,
    value: string,
    onChange: (key: string, value: string) => void
  ) => (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Icon name={iconName} type="material-community" size={24} color="#666" />
        <Text style={{ marginLeft: 10, fontSize: 16, color: "#666" }}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(keyName, text)}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          padding: 10,
          fontSize: 16,
        }}
      />
    </View>
  );
  

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    name: "Priya Ingle",
    gender: "Female",
    birthday: "26-02-2004",
    address: "Pune, Maharashtra",
    subscriptions: "Active",
  });
  const [inviteCode, setInviteCode] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        if (user.inviteCode) {
          setInviteCode(user.inviteCode);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const generateInviteCode = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        Alert.alert("Error", "User data not found. Please login again");
        return;
      }

      const user = JSON.parse(userData);
      if (user.role !== "patient") {
        Alert.alert("Error", "Only patients can generate invite codes");
        return;
      }

      console.log("Generating invite code...");
      const response = await axios.post(
        "http://takecare-ds3g.onrender.com/api/patient/generate-invite",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Response:", response.data);
      setInviteCode(response.data.inviteCode);
      
      // Update user data in AsyncStorage
      user.inviteCode = response.data.inviteCode;
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert("Success", "Invite code generated successfully!");
    } catch (error: any) {
      console.error("Error generating invite code:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert("Error", "Your session has expired. Please login again.");
      } else {
        Alert.alert(
          "Error", 
          error.response?.data?.error || "Failed to generate invite code. Please try again."
        );
      }
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    console.log("Saved Data:", formData);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity>
          <Icon name="arrow-left" type="material-community" size={28} color="blue" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "blue", marginLeft: 10 }}>Profile</Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Icon name="share-variant" type="material-community" size={24} color="black" />
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        {/* <ProfileSVG width={100} height={100} /> */}
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
          {formData.name}
        </Text>
        {userRole === "patient" && (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={{ color: "gray" }}>
              Invite Code: {inviteCode || "Not generated"}
            </Text>
            {!inviteCode && (
              <TouchableOpacity
                onPress={generateInviteCode}
                style={{
                  backgroundColor: "#3AA0EB",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Generate Invite Code
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={{ padding: 20 }}>
        {renderProfileItem("account-circle", "Name", "name", formData.name, handleInputChange)}
        {renderProfileItem("cake", "Birthday", "birthday", formData.birthday, handleInputChange)}
        {renderProfileItem("gender-male", "Gender", "gender", formData.gender, handleInputChange)}
        {renderProfileItem("map-marker", "Home Address", "address", formData.address, handleInputChange)}
        {renderProfileItem("credit-card", "Subscriptions", "subscriptions", formData.subscriptions, handleInputChange)}
      </View>

      <TouchableOpacity onPress={handleSave} style={{ backgroundColor: "blue", padding: 10, margin: 20, borderRadius: 5, alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
