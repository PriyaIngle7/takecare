import { Dimensions, StyleSheet, TextInput, Text, View } from "react-native";
import React, { useState } from "react";
const { width } = Dimensions.get("window");
const scale = width / 320;
const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
  return (
    <View
      style={{
        paddingVertical: 50 * scale,
        width: "90%",
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{ fontSize: 25 * scale, color: "#1F41BB", fontWeight: "bold" }}
      >
        Login here
      </Text>
      <Text
        style={{ fontSize: 15 * scale, fontWeight: "500", textAlign: "center" }}
      >
        Welcome back you've been missed!
      </Text>

      <TextInput
      style={{}}
      value={email}
      onChangeText={setEmail}
      />

    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
