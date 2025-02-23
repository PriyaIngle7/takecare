import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
const { width } = Dimensions.get("window");
const scale = width / 320;
const Createcaretaker = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingVertical: 20 * scale,
        paddingHorizontal: 15 * scale,
      }}
    >
      <Text
        style={{
          color: "#1F41BB",
          fontSize: 30 * scale,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Create Account as Caretaker
      </Text>
      <Text style={{ width: "90%", textAlign: "center", fontSize: 12 * scale }}>
        Join us today and explore a new way to stay connected with your loved
        ones.
      </Text>
      <View style={{ marginTop: 20 * scale }}>
        <TextInput
          style={{
            borderWidth: 1 * scale,
            borderRadius: 10 * scale,
            paddingHorizontal: 10 * scale,
            paddingVertical: 15 * scale,
          }}
          onChangeText={setName}
          value={name}
          placeholder="Name"
        />
        <TextInput
          style={{
            borderWidth: 1 * scale,
            borderRadius: 10 * scale,
            paddingHorizontal: 10 * scale,
            paddingVertical: 15 * scale,
            marginTop: 10 * scale,
          }}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
        />
        <TextInput
          style={{
            borderWidth: 1 * scale,
            borderRadius: 10 * scale,
            paddingHorizontal: 10 * scale,
            paddingVertical: 15 * scale,
            marginTop: 10 * scale,
          }}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          console.log("Pressed");
        }}
        style={{
          backgroundColor: "#3AA0EB",
          marginTop: 10 * scale,
          borderRadius: 10 * scale,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            textAlign: "center",
            paddingVertical: 10 * scale,
            fontSize: 15 * scale,
          }}
        >
          Sign up
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Createcaretaker;
