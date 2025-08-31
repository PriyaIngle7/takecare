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
import { Formik } from "formik";
import * as Yup from "yup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  patientInviteCode?: string;
  role: "caretaker" | "patient";
}

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Features: undefined;
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
  patientInviteCode: Yup.string().when("role", {
    is: "caretaker",
    then: (schema) => schema.optional(),
  }),
});

const Createcaretaker: React.FC<CreatecaretakerProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<"caretaker" | "patient">("caretaker");
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const { login } = useAuth();

  const handleSignup = async (values: SignupFormValues) => {
    try {
      const apiEndpoint = selectedRole === "patient" 
        ? "https://takecare-ds3g.onrender.com/api/patient/signup"
        : "https://takecare-ds3g.onrender.com/api/signup";

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: selectedRole,
      };

      const response = await axios.post(apiEndpoint, payload);

      // Use the auth context to handle login
      const userData = response.data.patient || response.data.user;
      await login(response.data.token, userData);

      // If caretaker and invite code provided, validate it
      if (selectedRole === "caretaker" && values.patientInviteCode) {
        try {
          const validateResponse = await axios.post(
            "https://takecare-ds3g.onrender.com/api/caretaker/validate-invite",
            { inviteCode: values.patientInviteCode },
            {
              headers: {
                Authorization: `B earer ${response.data.token}`,
              },
            }
          );
          Alert.alert("Success", "Successfully linked with patient!");
        } catch (error: any) {
          Alert.alert(
            "Error",
            error.response?.data?.error || "Failed to validate patient invite code"
          );
        }
      }

      // If patient, show their invite code
      if (selectedRole === "patient" && response.data.inviteCode) {
        setGeneratedInviteCode(response.data.inviteCode);
        setShowInviteCode(true);
      }
      // Navigation will be handled automatically by the auth context
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
            paddingVertical: 10 * scale,
            width: "85%",
            alignSelf: "center",
          }}
        >
          {showInviteCode ? (
            <View style={{ alignItems: "center", padding: 20 * scale }}>
              <Text style={{ fontSize: 20 * scale, fontWeight: "bold", marginBottom: 20 * scale }}>
                Your Invite Code
              </Text>
              <View style={{
                backgroundColor: "#F1F4FF",
                padding: 20 * scale,
                borderRadius: 10 * scale,
                width: "100%",
                alignItems: "center"
              }}>
                <Text style={{ fontSize: 24 * scale, fontWeight: "bold", color: "#1F41BB" }}>
                  {generatedInviteCode}
                </Text>
                <Text style={{ marginTop: 10 * scale, textAlign: "center", color: "#666" }}>
                  Share this code with your caretaker to link your accounts
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Features")}
                style={{
                  backgroundColor: "#3AA0EB",
                  marginTop: 30 * scale,
                  borderRadius: 10 * scale,
                  paddingHorizontal: 40 * scale,
                  paddingVertical: 15 * scale,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 16 * scale }}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
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
                  patientInviteCode: "",
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

                    {selectedRole === "caretaker" && (
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
                          onChangeText={handleChange("patientInviteCode")}
                          onBlur={handleBlur("patientInviteCode")}
                          value={values.patientInviteCode}
                          placeholder="Patient Invite Code (Optional)"
                          placeholderTextColor={"#626262"}
                        />
                        {errors.patientInviteCode && touched.patientInviteCode && (
                          <Text style={{ color: "red", fontSize: 10 * scale }}>
                            {errors.patientInviteCode}
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
                  marginTop: 50 * scale,
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
            </>
          )}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Createcaretaker;

