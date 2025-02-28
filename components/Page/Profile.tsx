import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-elements";

const renderProfileItem = (
    iconName: string,
    label: string,
    keyName: string,
    value: string,
    onChange: (key: string, value: string) => void
  ) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon name={iconName} type="material-community" size={24} color="#000" />
        <Text style={{ marginLeft: 10, fontSize: 16 }}>{label}</Text>
      </View>
      <TextInput
        style={{ fontSize: 16, color: "gray", borderBottomWidth: 1, borderBottomColor: "#000", width: 150 }}
        value={value}
        onChangeText={(text) => onChange(keyName, text)}
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
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
          {formData.name}
        </Text>
        <Text style={{ color: "gray" }}>Invite Code: #jsdfjf</Text>
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
