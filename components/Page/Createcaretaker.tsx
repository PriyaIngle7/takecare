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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from "formik";
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GoogleSvg from "../../assets/images/google";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  role: 'caretaker' | 'patient';
}

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

type CreatecaretakerProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .required('Required'),
  role: Yup.string()
    .oneOf(['caretaker', 'patient'], 'Invalid role')
    .required('Required'),
});

const Createcaretaker: React.FC<CreatecaretakerProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<'caretaker' | 'patient'>('caretaker');

  const handleSignup = async (values: SignupFormValues) => {
    try {
      const response = await axios.post('https://1079b24c-6006-49c7-a813-33314abf7f5c-00-1xbnvel08l5rw.sisko.replit.dev/api/signup', {
        name: values.name,
        email: values.email,
        password: values.password,
        role: selectedRole
      });
      
      // Store the token and user data
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate to dashboard or home screen
      navigation.navigate('Dashboard');
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.error || 'An error occurred during signup. Please try again.'
      );
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
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
          <Text style={{ width: "90%", textAlign: "center", fontSize: 12 * scale }}>
            Join us today and explore a new way to stay connected with your loved
            ones.
          </Text>

          {/* Role Selection */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            marginTop: 20 * scale,
            marginBottom: 20 * scale,
            backgroundColor: '#F1F4FF',
            borderRadius: 10 * scale,
            padding: 10 * scale,
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: selectedRole === 'caretaker' ? '#3AA0EB' : 'transparent',
                padding: 10 * scale,
                borderRadius: 8 * scale,
                flex: 1,
                alignItems: 'center',
                marginHorizontal: 5 * scale,
              }}
              onPress={() => setSelectedRole('caretaker')}
            >
              <Text style={{
                color: selectedRole === 'caretaker' ? '#fff' : '#1F41BB',
                fontWeight: 'bold',
              }}>
                Caretaker
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: selectedRole === 'patient' ? '#3AA0EB' : 'transparent',
                padding: 10 * scale,
                borderRadius: 8 * scale,
                flex: 1,
                alignItems: 'center',
                marginHorizontal: 5 * scale,
              }}
              onPress={() => setSelectedRole('patient')}
            >
              <Text style={{
                color: selectedRole === 'patient' ? '#fff' : '#1F41BB',
                fontWeight: 'bold',
              }}>
                Patient
              </Text>
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={{ name: "", email: "", password: "", role: selectedRole }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
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
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder="Name"
                    placeholderTextColor={"#626262"}
                  />
                  {errors.name && touched.name && (
                    <Text style={{ color: 'red', fontSize: 10 * scale }}>{errors.name}</Text>
                  )}

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
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder="Email"
                    placeholderTextColor={"#626262"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && touched.email && (
                    <Text style={{ color: 'red', fontSize: 10 * scale }}>{errors.email}</Text>
                  )}

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
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder="Password"
                    placeholderTextColor={"#626262"}
                    secureTextEntry
                  />
                  {errors.password && touched.password && (
                    <Text style={{ color: 'red', fontSize: 10 * scale }}>{errors.password}</Text>
                  )}
                </View>

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
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
