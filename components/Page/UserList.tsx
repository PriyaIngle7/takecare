import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
const { width } = Dimensions.get("window");
const scale = width / 320;
import UserImage1 from "@/assets/images/userImage1";

const UserList = () => {
  const [search, setSearch] = useState("");
  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View
        style={{
          paddingVertical: 10 * scale,
          paddingHorizontal: 10 * scale,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 2,
        }}
      >
        <AntDesign name="arrowleft" size={20 * scale} color="#0B82D4" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: "#C4DBFA",
            width: "80%",
            borderRadius: 10 * scale,
          }}
        />
        <AntDesign name="search1" size={20 * scale} color="#0B82D4" />
      </View>

      <View style={{ flexDirection: "row" }}>
        <Image
          style={{ left: -35 * scale, top: -35 * scale }}
          source={require("../../assets/images/userImage2.png")}
        />
        <Text style={{ alignSelf: "center", fontSize: 20 * scale,fontWeight:"700" }}>
          User's List
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserList;

const styles = StyleSheet.create({});
