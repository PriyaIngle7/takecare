import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Share } from "react-native";
import { Icon } from "react-native-elements";
import { useAuth } from "@/contexts/AuthContext";

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

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "Priya Ingle",
    gender: "Female",
    birthday: "26-02-2004",
    address: "Pune, Maharashtra",
    subscriptions: "Active",
  });
  const [inviteCode, setInviteCode] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (user) {
      setUserRole(user.role);
      if (user.inviteCode) {
        setInviteCode(user.inviteCode);
      }
      setFormData((prev) => ({
        ...prev,
        name: user.name,
      }));
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    console.log("Saved Data:", formData);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  // 🔹 Share function
  const handleShare = async () => {
    try {
      const message =
        userRole === "patient"
          ? `Hey! Here’s my profile:\n\n👤 Name: ${formData.name}\n🎂 Birthday: ${formData.birthday}\n📍 Address: ${formData.address}\n\nInvite Code: ${inviteCode || "Not generated"}`
          : `Hey! Here’s my profile:\n\n👤 Name: ${formData.name}\n🎂 Birthday: ${formData.birthday}\n📍 Address: ${formData.address}`;

      await Share.share({
        message,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="material-community" size={28} color="blue" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "blue", marginLeft: 10 }}>
          Profile
        </Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share-variant" type="material-community" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
          {formData.name}
        </Text>
        {userRole === "patient" && (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={{ color: "gray" }}>
              Invite Code: {inviteCode || "Not generated"}
            </Text>
          </View>
        )}
      </View>

      {/* Profile Items */}
      <View style={{ padding: 20 }}>
        {renderProfileItem("account-circle", "Name", "name", formData.name, handleInputChange)}
        {renderProfileItem("cake", "Birthday", "birthday", formData.birthday, handleInputChange)}
        {renderProfileItem("gender-male", "Gender", "gender", formData.gender, handleInputChange)}
        {renderProfileItem("map-marker", "Home Address", "address", formData.address, handleInputChange)}
        {renderProfileItem("credit-card", "Subscriptions", "subscriptions", formData.subscriptions, handleInputChange)}
      </View>

      {/* Buttons */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "blue",
          padding: 10,
          margin: 20,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "red",
          padding: 10,
          margin: 20,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
