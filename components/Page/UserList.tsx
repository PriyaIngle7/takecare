import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
const { width } = Dimensions.get("window");
const scale = width / 320;

import UserListImg1 from "../../assets/images/userListImgh1" 


const UserList = () => {
  const [search, setSearch] = useState("");
  return (
    <SafeAreaView>
      <View
        style={{
          paddingVertical: 10 * scale,
          paddingHorizontal:10*scale,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#fff",
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

      <View
      style={{marginTop:100}}>
      <UserListImg1/>
      </View>
    </SafeAreaView>
  );
};

export default UserList;

const styles = StyleSheet.create({});
