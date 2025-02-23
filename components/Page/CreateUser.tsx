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
  import GoogleSvg from "../../assets/images/google";
  
const CreateUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingVertical: 40 * scale,
          width: "85%",
          alignSelf: "center",
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
          Create Account as User
        </Text>
        <Text style={{ width: "90%", textAlign: "center", fontSize: 12 * scale }}>
          Join us today and explore a new way to stay connected with your loved
          ones.
        </Text>
        <View style={{ marginTop: 30 * scale }}>
          <TextInput
            style={{
              borderWidth: 1 * scale,
              borderRadius: 10 * scale,
              paddingHorizontal: 10 * scale,
              paddingVertical: 15 * scale,
              backgroundColor: "#F1F4FF",
              fontSize: 12 * scale,
            }}
            onChangeText={setName}
            value={name}
            placeholder="Name"
            placeholderTextColor={"#626262"}
          />
          <TextInput
            style={{
              borderWidth: 1 * scale,
              borderRadius: 10 * scale,
              paddingHorizontal: 10 * scale,
              paddingVertical: 15 * scale,
              marginTop: 20 * scale,
              backgroundColor: "#F1F4FF",
              fontSize: 12 * scale,
            }}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor={"#626262"}
          />
          <TextInput
            style={{
              borderWidth: 1 * scale,
              borderRadius: 10 * scale,
              paddingHorizontal: 10 * scale,
              paddingVertical: 15 * scale,
              marginTop: 20 * scale,
              backgroundColor: "#F1F4FF",
              fontSize: 12 * scale,
            }}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor={"#626262"}
          />
          <TextInput
            style={{
              borderWidth: 1 * scale,
              borderRadius: 10 * scale,
              paddingHorizontal: 10 * scale,
              paddingVertical: 15 * scale,
              marginTop: 20 * scale,
              backgroundColor: "#F1F4FF",
              fontSize: 12 * scale,
            }}
            onChangeText={setInviteCode}
            value={inviteCode}
            placeholder="Invite Code"
            placeholderTextColor={"#626262"}
          />
        </View>
  
        <TouchableOpacity
          onPress={() => {
            console.log("Pressed");
          }}
          style={{
            backgroundColor: "#3AA0EB",
            marginTop: 30 * scale,
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
  
        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            marginTop: 50 * scale,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Already have an account</Text>
          <Text
            style={{
              color: "#1F41BB",
              fontWeight: "bold",
              marginTop: 5 * scale,
            }}
          >
            Or continue with
          </Text>
          <View
            style={{
              backgroundColor: "#ECECEC",
              borderRadius: 10 * scale,
              paddingVertical: 5 * scale,
              paddingHorizontal: 5 * scale,
              marginTop: 5 * scale,
            }}
          >
            <GoogleSvg />
          </View>
        </View>
      </SafeAreaView>
    );
  };


export default CreateUser
