import {
  Dimensions,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import LoginLogo from "../compo/LoginLogo";
import GoogleSvg from "@/assets/images/google";
import AppleSvg from "@/assets/images/apple";
import FacebookSvg from "@/assets/images/facebook";
const { width } = Dimensions.get("window");
const scale = width / 320;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";


import { Formik } from "formik";

const Login = () => {
  const navigation = useNavigation(); 
  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      const apiEndpoint = "https://takecare-ds3g.onrender.com/api/signin";

      const payload = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post(apiEndpoint, payload);

      // Store token and user data
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      navigation.navigate("Features" as never); // cast to fix TS complaint
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.error ||
          "An error occurred during login. Please try again."
      );
      console.log(err);
    }
  };
  return (
    <View
      style={{
        paddingVertical: 50 * scale,
        flex: 1,
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
        style={{
          fontSize: 15 * scale,
          fontWeight: "500",
          textAlign: "center",
          marginTop: 5 * scale,
        }}
      >
        Welcome back you've been missed!
      </Text>

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSignIn}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={{ width: "90%" }}>
            <TextInput
              style={{
                borderWidth: 1 * scale,
                borderRadius: 10 * scale,
                paddingHorizontal: 15 * scale,
                paddingVertical: 12 * scale,
                backgroundColor: "#F1F4FF",
                fontSize: 12 * scale,
                marginTop: 30 * scale,
              }}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Email"
              placeholderTextColor={"#626262"}
            />
            <TextInput
              style={{
                borderWidth: 1 * scale,
                borderRadius: 10 * scale,
                paddingHorizontal: 15 * scale,
                paddingVertical: 12 * scale,
                backgroundColor: "#F1F4FF",
                fontSize: 12 * scale,
                marginTop: 15 * scale,
              }}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="Password"
              placeholderTextColor={"#626262"}
            />
            <Text
              style={{
                color: "#1F41BB",
                fontWeight: "800",
                textAlign: "right",
                marginTop: 5 * scale,
              }}
            >
              Forgot your password?
            </Text>

            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={{
                backgroundColor: "#3AA0EB",
                paddingVertical: 10 * scale,
                borderRadius: 10 * scale,
                marginTop: 10 * scale,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#ffffff",
                  fontSize: 14 * scale,
                  fontWeight: "500",
                }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
            <Text
              onPress={() => {
                navigation.navigate("Createcaretaker")
              }}
              style={{
                textAlign: "center",
                marginTop: 30 * scale,
                fontSize: 13 * scale,
              }}
            >
              Create new account
            </Text>
          </View>
        )}
      </Formik>

      <View style={{ marginTop: 100 * scale }}>
        <Text
          style={{ color: "#1F41BB", fontWeight: "bold", textAlign: "center" }}
        >
          Or continue with
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "60%",
          }}
        >
          <LoginLogo componentPass={<GoogleSvg />} />
          <LoginLogo componentPass={<AppleSvg />} />
          <LoginLogo componentPass={<FacebookSvg />} />
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
