import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
const { width } = Dimensions.get("window");
const scale = width / 320;
import SettingsImage from "../../assets/images/settingsImg";
import Settings11 from "../../assets/images/settings11";
const NameCard = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20 * scale,
        justifyContent: "space-around",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{
            width: 50 * scale,
            height: 50 * scale,
            borderRadius: 100 * scale,
          }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
          }}
        />
        <View style={{ paddingHorizontal: 10 * scale }}>
          <Text style={{ fontSize: 14 * scale, color: "#1E90FF" }}>
            Hi, Welcome Back
          </Text>
          <Text style={{ fontSize: 16 * scale, fontWeight: "bold" }}>
            John Doe
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <SettingsImage />
        <Settings11 />
      </View>
    </View>
  );
};

export default NameCard;

const styles = StyleSheet.create({});
