import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
const { width } = Dimensions.get("window");
const scale = width / 320;
import SettingsImage from "../../assets/images/settingsImg";
import Settings11 from "../../assets/images/settings11";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  ProfileScreen: undefined;
  Settings: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const NameCard = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20 * scale,
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#e6f0ff",
        borderRadius: 10,
        marginHorizontal: 15,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileScreen")}
          activeOpacity={0.7}
        >
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
        </TouchableOpacity>
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
        <TouchableOpacity 
          onPress={() => navigation.navigate("Settings")}
          activeOpacity={0.7}
        >
          <SettingsImage />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Settings")}
          activeOpacity={0.7}
        >
          <Settings11 />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NameCard;

const styles = StyleSheet.create({});
