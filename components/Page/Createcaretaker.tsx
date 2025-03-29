
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  caretakerPhoneNumber?: string;
  role: "caretaker" | "patient";
}

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

type CreatecaretakerProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

// Validation Schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  role: Yup.string()
    .oneOf(["caretaker", "patient"], "Invalid role")
    .required("Required"),
  caretakerPhoneNumber: Yup.string().when("role", {
    is: "patient",
    then: (schema) =>
      schema
        .required("Caretaker Phone Number is required")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  }),
});

const Createcaretaker: React.FC<CreatecaretakerProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<"caretaker" | "patient">(
    "caretaker"
  );

  const handleSignup = async (values: SignupFormValues) => {
    try {
      const apiEndpoint =
        selectedRole === "caretaker"
          ? "https://takecare-ds3g.onrender.com/api/signup"
          : "https://takecare-ds3g.onrender.com/api/patient/signup";

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: selectedRole,
        ...(selectedRole === "patient" && {
          caretakerPhoneNumber: values.caretakerPhoneNumber,
        }),
      };

      const response = await axios.post(apiEndpoint, payload);

      // Store token and user data
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      navigation.navigate("Dashboard");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.error ||
          "An error occurred during signup. Please try again."
      );
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView>
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
            Create Account
          </Text>
          <Text
            style={{ width: "90%", textAlign: "center", fontSize: 12 * scale }}
          >
            Join us today and explore a new way to stay connected with your
            loved ones.
          </Text>

          {/* Role Selection */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 20 * scale,
              marginBottom: 20 * scale,
              backgroundColor: "#F1F4FF",
              borderRadius: 10 * scale,
              padding: 10 * scale,
            }}
          >
            {["caretaker", "patient"].map((role) => (
              <TouchableOpacity
                key={role}
                style={{
                  backgroundColor:
                    selectedRole === role ? "#3AA0EB" : "transparent",
                  padding: 10 * scale,
                  borderRadius: 8 * scale,
                  flex: 1,
                  alignItems: "center",
                  marginHorizontal: 5 * scale,
                }}
                onPress={() => setSelectedRole(role as "caretaker" | "patient")}
              >
                <Text
                  style={{
                    color: selectedRole === role ? "#fff" : "#1F41BB",
                    fontWeight: "bold",
                  }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              caretakerPhoneNumber: "",
              role: selectedRole,
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                {["name", "email", "password"].map((field) => (
                  <View key={field} style={{ marginTop: 20 * scale }}>
                    <TextInput
                      style={{
                        borderWidth: 1 * scale,
                        borderRadius: 10 * scale,
                        paddingHorizontal: 10 * scale,
                        paddingVertical: 15 * scale,
                        backgroundColor: "#F1F4FF",
                        fontSize: 12 * scale,
                      }}
                      onChangeText={handleChange(field)}
                      onBlur={handleBlur(field)}
                      value={values[field as keyof SignupFormValues] as string}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      placeholderTextColor={"#626262"}
                      secureTextEntry={field === "password"}
                      keyboardType={field === "email" ? "email-address" : "default"}
                      autoCapitalize="none"
                    />
                    {errors[field as keyof SignupFormValues] &&
                      touched[field as keyof SignupFormValues] && (
                        <Text style={{ color: "red", fontSize: 10 * scale }}>
                          {errors[field as keyof SignupFormValues]}
                        </Text>
                      )}
                  </View>
                ))}

                {selectedRole === "patient" && (
                  <View style={{ marginTop: 20 * scale }}>
                    <TextInput
                      style={{
                        borderWidth: 1 * scale,
                        borderRadius: 10 * scale,
                        paddingHorizontal: 10 * scale,
                        paddingVertical: 15 * scale,
                        backgroundColor: "#F1F4FF",
                        fontSize: 12 * scale,
                      }}
                      onChangeText={handleChange("caretakerPhoneNumber")}
                      onBlur={handleBlur("caretakerPhoneNumber")}
                      value={values.caretakerPhoneNumber}
                      placeholder="Caretaker Phone Number"
                      placeholderTextColor={"#626262"}
                      keyboardType="numeric"
                    />
                    {errors.caretakerPhoneNumber &&
                      touched.caretakerPhoneNumber && (
                        <Text style={{ color: "red", fontSize: 10 * scale }}>
                          {errors.caretakerPhoneNumber}
                        </Text>
                      )}
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => handleSubmit()}
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
              </View>
            )}
          </Formik>
          
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              marginTop: 80 * scale,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Already have an account</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  color: "#1F41BB",
                  fontWeight: "bold",
                  marginTop: 5 * scale,
                }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
          
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Createcaretaker;

